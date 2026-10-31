#!/usr/bin/env python3
"""Fetch verified installation/update inputs from the DavPanel GitHub release."""

import argparse
import hashlib
import json
import os
import platform
import re
import shutil
import subprocess
import sys
import tarfile
import tempfile
import urllib.error
import urllib.request
from pathlib import Path, PurePosixPath


VERSION = re.compile(r"^v?(\d+\.\d+\.\d+(?:-beta)?)$")


def read_url(url):
    request = urllib.request.Request(url, headers={"User-Agent": "DavPanel-Release-Manager", "Accept": "application/vnd.github+json"})
    return urllib.request.urlopen(request, timeout=45)


def release_metadata(api, repository, version=None, beta=False):
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
        raise ValueError("Invalid GitHub repository name.")
    endpoint = api.rstrip("/") + "/repos/" + repository + "/releases"
    if version:
        match = VERSION.fullmatch(version)
        if not match:
            raise ValueError("Invalid release version.")
        for tag in ("v" + match[1], match[1]):
            try:
                with read_url(endpoint + "/tags/" + tag) as response:
                    release = json.load(response)
                break
            except urllib.error.HTTPError as error:
                if error.code != 404:
                    raise
        else:
            raise ValueError("Requested DavPanel release is not published.")
    elif beta:
        with read_url(endpoint + "?per_page=100") as response:
            releases = json.load(response)
        release = next((r for r in releases if not r.get("draft") and r.get("prerelease") and VERSION.fullmatch(r.get("tag_name", ""))), None)
        if not release:
            raise ValueError("No published beta release is available.")
    else:
        with read_url(endpoint + "/latest") as response:
            release = json.load(response)
    match = VERSION.fullmatch(release.get("tag_name", ""))
    if not match or release.get("draft"):
        raise ValueError("GitHub returned an invalid or draft release.")
    return release, match[1]


def safe_extract(archive, destination):
    with tarfile.open(archive, "r:gz") as source:
        members = source.getmembers()
        seen = set()
        for member in members:
            name = PurePosixPath(member.name)
            if name.is_absolute() or ".." in name.parts or not name.parts or str(name) in seen:
                raise ValueError("Unsafe or duplicate release archive member.")
            if not (member.isfile() or member.isdir()):
                raise ValueError("Release links and special files are not allowed.")
            seen.add(str(name))
        for member in members:
            target = destination.joinpath(*PurePosixPath(member.name).parts)
            if member.isdir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with source.extractfile(member) as incoming, target.open("wb") as outgoing:
                    shutil.copyfileobj(incoming, outgoing)
                target.chmod(member.mode & 0o755)


def fetch_release(release, version, architecture, cache):
    filename = f"davpanel-{version}-linux-{architecture}.tar.gz"
    assets = {asset["name"]: asset["browser_download_url"] for asset in release.get("assets", [])}
    if filename not in assets or filename + ".sha256" not in assets:
        raise ValueError("Release archive/checksum assets are not available yet.")
    with read_url(assets[filename + ".sha256"]) as response:
        fields = response.read(4096).decode().split()
    if len(fields) != 2 or not re.fullmatch(r"[0-9a-f]{64}", fields[0]) or fields[1] != filename:
        raise ValueError("Invalid release checksum file.")
    expected = fields[0]
    cache.mkdir(mode=0o700, parents=True, exist_ok=True)
    destination = cache / f"{version}-{architecture}-{expected[:16]}"
    marker = destination / ".release-sha256"
    if marker.is_file() and marker.read_text().strip() == expected:
        subprocess.run([sys.executable, str(destination / "scripts/preflight.py"), "--root", str(destination), "--arch", architecture, "--require-artifacts"], check=True, stdout=sys.stderr)
        return destination
    with tempfile.TemporaryDirectory(prefix=".download-", dir=cache) as temporary:
        work = Path(temporary)
        archive = work / filename
        digest = hashlib.sha256()
        with read_url(assets[filename]) as response, archive.open("wb") as output:
            while chunk := response.read(1024 * 1024):
                digest.update(chunk)
                output.write(chunk)
        if digest.hexdigest() != expected:
            raise ValueError("Release checksum mismatch; installed files were not changed.")
        source = work / "source"
        source.mkdir()
        safe_extract(archive, source)
        subprocess.run([sys.executable, str(source / "scripts/preflight.py"), "--root", str(source), "--arch", architecture, "--require-artifacts"], check=True, stdout=sys.stderr)
        (source / ".release-sha256").write_text(expected + "\n")
        if destination.exists():
            raise ValueError("Incomplete release cache exists; inspect it before retrying: " + str(destination))
        source.rename(destination)
    return destination


def build_image(source, version, image):
    with tempfile.TemporaryDirectory(prefix="davpanel-image-") as temporary:
        context = Path(temporary)
        (context / "bin").mkdir()
        (context / "davcli").mkdir()
        shutil.copy2(source / "bin/davpanel", context / "bin/davpanel")
        shutil.copy2(source / "davcli/davcli", context / "davcli/davcli")
        shutil.copy2(source / "davpanel/Dockerfile.release", context / "Dockerfile")
        subprocess.run(["podman", "build", "-t", image + ":" + version, str(context)], check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("latest", "fetch", "image"))
    parser.add_argument("--repository", default=os.getenv("DAVPANEL_REPOSITORY", "kangpcode/DavPanel"))
    parser.add_argument("--api", default=os.getenv("DAVPANEL_GITHUB_API", "https://api.github.com"))
    parser.add_argument("--version")
    parser.add_argument("--beta", action="store_true")
    parser.add_argument("--arch", choices=("amd64", "arm64"), default={"x86_64": "amd64", "aarch64": "arm64"}.get(platform.machine()))
    parser.add_argument("--cache", type=Path, default=Path("/var/cache/davpanel/releases"))
    parser.add_argument("--image", default="ghcr.io/kangpcode/davpanel")
    args = parser.parse_args()
    try:
        release, version = release_metadata(args.api, args.repository, args.version, args.beta)
        if args.command == "latest":
            print(version)
            return 0
        if not args.arch:
            raise ValueError("Unsupported CPU architecture.")
        source = fetch_release(release, version, args.arch, args.cache)
        if args.command == "image":
            build_image(source, version, args.image)
        else:
            print(source)
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"DavPanel release operation failed: {error}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
