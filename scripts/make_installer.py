#!/usr/bin/env python3
"""Wrap a release archive in the single-command DavPanel installer."""

import argparse
import hashlib
import shutil
from pathlib import Path


def make_installer(archive, output, bootstrap):
    checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
    template = bootstrap.read_text()
    if "DP_EMBEDDED_OFFSET=0" not in template or 'DP_EMBEDDED_SHA256=""' not in template:
        raise ValueError("Installer template is missing its release metadata fields.")
    template = template.replace('DP_EMBEDDED_SHA256=""', f'DP_EMBEDDED_SHA256="{checksum}"')
    offset = 0
    while True:
        header = (template.replace("DP_EMBEDDED_OFFSET=0", f"DP_EMBEDDED_OFFSET={offset}")
                  + "\nexit 0\n__DAVPANEL_PAYLOAD_BELOW__\n").encode()
        actual = len(header) + 1
        if offset == actual:
            break
        offset = actual
    with output.open("wb") as target, archive.open("rb") as payload:
        target.write(header)
        shutil.copyfileobj(payload, target)
    output.chmod(0o755)
    digest = hashlib.sha256(output.read_bytes()).hexdigest()
    output.with_suffix(output.suffix + ".sha256").write_text(f"{digest}  {output.name}\n")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--bootstrap", type=Path, default=Path(__file__).resolve().parents[1] / "install.sh")
    args = parser.parse_args()
    make_installer(args.archive, args.output, args.bootstrap)
    print(f"Standalone installer: {args.output}")


if __name__ == "__main__":
    main()
