#!/usr/bin/env python3
"""Check whether the hosting fork's declared component sources are present."""

import argparse
import configparser
import json
from pathlib import Path
import subprocess


def inspect_sources(root):
    config = configparser.ConfigParser(interpolation=None)
    config.read(root / ".gitmodules")
    index = subprocess.run(
        ["git", "-C", str(root), "ls-files", "--stage", "-z"],
        check=True, capture_output=True, text=True,
    )
    gitlinks = {}
    for entry in index.stdout.split("\0"):
        if not entry:
            continue
        metadata, path = entry.split("\t", 1)
        mode, commit, stage = metadata.split()
        if mode == "160000" and stage == "0":
            gitlinks[path] = commit

    components = []
    for section in config.sections():
        relative_path = config[section]["path"]
        directory = root / relative_path
        populated = directory.is_dir() and any(
            item.name != ".git" for item in directory.iterdir()
        )
        components.append({
            "path": relative_path,
            "url": config[section]["url"],
            "branch": config[section].get("branch"),
            "source_present": populated,
            "gitlink_commit": gitlinks.get(relative_path),
        })

    hosting_present = (root / "davpanel/go.mod").is_file()
    analytics_present = (root / "openpanel-main/packages/core/package.json").is_file()
    issues = []
    if not config.sections():
        issues.append("No component declarations found in .gitmodules.")
    if not hosting_present:
        issues.append("The DavPanel hosting Go module is missing.")
    for component in components:
        if not component["source_present"]:
            issues.append(f"{component['path']}: component source is missing or empty.")
        if not component["gitlink_commit"]:
            issues.append(
                f"{component['path']}: no pinned Git submodule entry; "
                "git submodule update cannot fetch this declaration."
            )

    return {
        "maintainer": "Dhafa Nazula Permadi (kangpcode)",
        "scope": "Local source inventory only; no runtime or remote availability checks.",
        "hosting_source_present": hosting_present,
        "analytics_reference_present": analytics_present,
        "source_warning": (
            "openpanel-main is a separate Bun/TypeScript analytics product; "
            "it does not contain the hosting OpenAdmin or OpenCLI components."
            if analytics_present else None
        ),
        "components": components,
        "issues": issues,
        "source_inventory_complete": not issues,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--json", action="store_true", help="Print a JSON report.")
    parser.add_argument(
        "--root", type=Path, default=Path(__file__).resolve().parents[1],
        help="Repository root (defaults to this script's repository).",
    )
    args = parser.parse_args()
    try:
        report = inspect_sources(args.root.resolve())
    except (OSError, subprocess.CalledProcessError, configparser.Error, KeyError) as error:
        parser.exit(2, f"Source audit failed: {error}\n")

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print("DavPanel component source audit")
        print(report["scope"])
        if report["source_warning"]:
            print(report["source_warning"])
        for component in report["components"]:
            state = "present" if component["source_present"] else "MISSING"
            pin = component["gitlink_commit"] or "UNREGISTERED"
            print(f"{component['path']}: source={state}, gitlink={pin}")
        for issue in report["issues"]:
            print(f"ERROR: {issue}")
        print("Source inventory: " + (
            "complete" if report["source_inventory_complete"] else "INCOMPLETE"
        ))
    return 0 if report["source_inventory_complete"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
