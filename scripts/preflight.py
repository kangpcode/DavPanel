#!/usr/bin/env python3
"""Read-only checks for a DavPanel source installation."""

import argparse
import hashlib
import json
import platform
import re
from pathlib import Path

from audit_sources import inspect_sources, tree_digest
from runtime_contracts import check_contracts


def check_artifacts(root, architecture):
    candidates = [root / "bin", root / "dist" / f"linux-{architecture}" / "bin"]
    binary_dir = next((p for p in candidates if (p / f"davadmin-{architecture}").is_file()), candidates[-1])
    errors = []
    machine = {"amd64": 62, "arm64": 183}[architecture]
    for filename in ("davpanel", f"davadmin-{architecture}"):
        binary = binary_dir / filename
        if not binary.is_file():
            errors.append(f"Missing binary: {binary}. Run bash scripts/build-release.sh --arch={architecture}")
            continue
        header = binary.read_bytes()[:20]
        if len(header) < 20 or header[:6] != b"\x7fELF\x02\x01" or int.from_bytes(header[18:20], "little") != machine:
            errors.append(f"{binary}: expected a 64-bit Linux {architecture} ELF binary.")
        if not binary.stat().st_mode & 0o111:
            errors.append(f"{binary}: binary is not executable.")
    checksum_file = binary_dir.parent / "SHA256SUMS"
    build_file = binary_dir.parent / "BUILD.json"
    if not build_file.is_file():
        errors.append(f"Missing build provenance: {build_file}")
    else:
        build = json.loads(build_file.read_text())
        for component in ("davpanel", "davadmin"):
            digest, _ = tree_digest(root / component)
            if digest != build["source_sha256"].get(component):
                errors.append(f"{component}: release binary predates the current source; rebuild the release.")
            toolchain = build.get("toolchain", {}).get(component, "")
            version = re.fullmatch(r"go(\d+)\.(\d+)\.(\d+)", toolchain)
            if not version or tuple(map(int, version.groups())) < (1, 27, 3):
                errors.append(f"{component}: release must be built with a stable Go 1.27.3 or newer toolchain.")
        if build.get("architecture") != architecture:
            errors.append("Release build provenance has the wrong architecture.")
    if not checksum_file.is_file():
        errors.append(f"Missing release checksums: {checksum_file}")
    else:
        expected = {"bin/davpanel", f"bin/davadmin-{architecture}"}
        seen = set()
        for line in checksum_file.read_text().splitlines():
            checksum, relative = line.split(maxsplit=1)
            if relative not in expected or relative in seen:
                errors.append(f"Unexpected checksum entry: {relative}")
                continue
            seen.add(relative)
            file = binary_dir.parent / relative
            if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != checksum:
                errors.append(f"{file}: release checksum mismatch.")
        if seen != expected:
            errors.append("Release checksum list is incomplete.")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--arch", choices=("amd64", "arm64"))
    parser.add_argument("--require-artifacts", action="store_true")
    args = parser.parse_args()
    architecture = args.arch or {"x86_64": "amd64", "aarch64": "arm64"}.get(platform.machine())
    if not architecture:
        parser.exit(1, "Only Linux amd64 and arm64 are supported.\n")
    root = args.root.resolve()
    try:
        report = inspect_sources(root)
        errors = report["issues"]
        errors += check_contracts(root)
        required = ("davcli/davcli", "configuration/davpanel/conf/davpanel.config",
                    "configuration/davadmin/service/davadmin.service", "davpanel/Dockerfile.release",
                    "caddy/Dockerfile", "vsftpd/Dockerfile")
        errors += [f"Missing installation input: {name}" for name in required if not (root / name).is_file()]
        if args.require_artifacts:
            errors += check_artifacts(root, architecture)
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.exit(1, f"Preflight failed: {error}\n")
    for error in errors:
        print("ERROR: " + error)
    if errors:
        return 1
    print(f"DavPanel preflight passed: 16 components, Linux {architecture}, "
          + ("release binaries verified." if args.require_artifacts else "source inputs verified."))
    print("Installation still requires a clean supported Linux server and access to base container images.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
