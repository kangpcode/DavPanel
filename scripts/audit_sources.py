#!/usr/bin/env python3
"""Verify vendored DavPanel components and their recorded source provenance."""

import argparse
import hashlib
import json
import re
from pathlib import Path


IGNORED = {".git", "node_modules", "__pycache__", ".expo", ".gradle"}
REQUIRED = {
    "davadmin", "davcli", "configuration", "tests", "translations", "mailserver",
    "vsftpd", "mobile", "integrations/virtualizor", "integrations/whmcs",
    "integrations/cpanel-import", "integrations/cyberpanel-import",
    "integrations/fossbilling", "integrations/paymenter.org",
    "integrations/clientexec", "integrations/wisecp",
}


def tree_digest(directory):
    digest = hashlib.sha256()
    count = 0
    for path in sorted(directory.rglob("*")):
        relative = path.relative_to(directory)
        if any(part in IGNORED for part in relative.parts):
            continue
        if path.is_symlink():
            payload, kind = str(path.readlink()).encode(), b"link"
        elif path.is_file():
            payload = path.read_bytes()
            kind = b"executable" if path.stat().st_mode & 0o111 else b"file"
        else:
            continue
        digest.update(relative.as_posix().encode() + b"\0" + kind + b"\0")
        digest.update(hashlib.sha256(payload).digest())
        count += 1
    return digest.hexdigest(), count


def inspect_sources(root, refresh=False):
    manifest_path = root / "components.lock.json"
    manifest = json.loads(manifest_path.read_text())
    issues, components = [], []
    if manifest.get("schema_version") != 1:
        raise ValueError("Unsupported component manifest schema.")
    seen = set()
    for component in manifest["components"]:
        relative = component["path"]
        if relative not in REQUIRED or relative in seen:
            raise ValueError(f"Unexpected or duplicate component path: {relative}")
        seen.add(relative)
        if not re.fullmatch(r"[0-9a-f]{40}", component["upstream_commit"]):
            issues.append(f"{relative}: invalid upstream commit pin.")
        directory = root / relative
        if directory.is_symlink() or not directory.is_dir():
            issues.append(f"{relative}: component directory is missing or symlinked.")
            components.append({"path": relative, "source_present": False})
            continue
        digest, count = tree_digest(directory)
        present = count > 1 and (directory / "FORK.md").is_file()
        if not present:
            issues.append(f"{relative}: component source or FORK.md is missing.")
        if refresh and present:
            component["tree_sha256"], component["file_count"] = digest, count
        matches = digest == component.get("tree_sha256")
        if not matches:
            issues.append(f"{relative}: source checksum differs from components.lock.json.")
        components.append({"path": relative, "source_present": present,
                           "file_count": count, "checksum_matches": matches,
                           "upstream_commit": component["upstream_commit"]})
    for missing in sorted(REQUIRED - seen):
        issues.append(f"{missing}: component is absent from the manifest.")
    hosting_present = (root / "davpanel/go.mod").is_file()
    if not hosting_present:
        issues.append("DavPanel hosting Go module is missing.")
    if refresh:
        if issues:
            raise ValueError("Cannot refresh an incomplete inventory: " + "; ".join(issues))
        manifest_path.write_text(json.dumps(manifest, indent=2) + "\n")
    reference = root / "openpanel-main"
    return {
        "maintainer": manifest["maintainer"],
        "scope": "Local source integrity only; runtime/deployment is validated separately.",
        "hosting_source_present": hosting_present,
        "primary_reference_type": (
            "hosting-go" if (reference / "openpanel/go.mod").is_file() else
            "analytics-typescript" if (reference / "packages/core/package.json").is_file() else
            "not-in-checkout"
        ),
        "components": components, "issues": issues,
        "source_inventory_complete": not issues,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true")
    parser.add_argument("--refresh-lock", action="store_true",
                        help="Record checksums after reviewing intentional component changes.")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    try:
        report = inspect_sources(args.root.resolve(), args.refresh_lock)
    except (OSError, ValueError, KeyError, TypeError) as error:
        parser.exit(2, f"Source audit failed: {error}\n")
    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print("DavPanel component source audit")
        print(report["scope"])
        print("Primary reference: " + report["primary_reference_type"])
        for component in report["components"]:
            state = "OK" if component.get("checksum_matches") else "INCOMPLETE"
            print(f"{component['path']}: {state} ({component.get('file_count', 0)} files)")
        for issue in report["issues"]:
            print("ERROR: " + issue)
        print("Source inventory: " + ("complete" if report["source_inventory_complete"] else "INCOMPLETE"))
    return 0 if report["source_inventory_complete"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
