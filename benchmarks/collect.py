#!/usr/bin/env python3
"""Collect comparable, sequential HTTP probes from operator-owned test servers."""

import argparse
import datetime
import json
import math
import platform
import statistics
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


def probe(label, url, samples, timeout):
    if urllib.parse.urlparse(url).scheme not in ("http", "https"):
        raise ValueError("Only HTTP(S) targets are supported.")
    times, failures = [], []
    for _ in range(samples):
        start = time.perf_counter()
        try:
            with urllib.request.urlopen(url, timeout=timeout) as response:
                response.read()
                if response.status != 200:
                    raise ValueError(f"HTTP {response.status}")
            times.append((time.perf_counter() - start) * 1000)
        except (OSError, ValueError) as error:
            failures.append(type(error).__name__)
    return {"product": label, "url": url, "attempts": samples, "successful": len(times),
            "failures": len(failures), "p50_ms": statistics.median(times) if times else None,
            "p95_ms": sorted(times)[math.ceil(len(times) * 0.95) - 1] if times else None,
            "mean_ms": statistics.mean(times) if times else None,
            "error_types": sorted(set(failures))}


def markdown(report):
    lines = ["# HTTP probe results", "", "Sequential login-page probes, not hosting workload throughput or capacity.", "",
             "| Product | Successful / attempted | p50 (ms) | p95 (ms) |",
             "| --- | --- | --- | --- |"]
    for result in report["results"]:
        number = lambda value: "Not measured" if value is None else f"{value:.2f}"
        lines.append(f"| {result['product']} | {result['successful']} / {result['attempts']} | {number(result['p50_ms'])} | {number(result['p95_ms'])} |")
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--targets", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--samples", type=int, default=20)
    parser.add_argument("--timeout", type=float, default=5)
    args = parser.parse_args()
    if not 1 <= args.samples <= 1000 or not 0 < args.timeout <= 60:
        parser.error("Use 1–1000 samples and a timeout up to 60 seconds.")
    targets = json.loads(args.targets.read_text())
    if not isinstance(targets, dict) or not targets:
        parser.error("Provide product names and HTTP URLs for your own test servers.")
    report = {"collected_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
              "client_platform": platform.platform(), "method": "sequential HTTP 200 response, including body and redirects",
              "results": [probe(label, url, args.samples, args.timeout) for label, url in targets.items()]}
    args.output.mkdir(parents=True, exist_ok=True)
    (args.output / "results.json").write_text(json.dumps(report, indent=2) + "\n")
    (args.output / "results.md").write_text(markdown(report))
    print(markdown(report))


if __name__ == "__main__":
    main()
