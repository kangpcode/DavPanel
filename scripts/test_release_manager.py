import hashlib
import io
import json
import tarfile
import tempfile
import unittest
from pathlib import Path

from release_manager import fetch_release, release_metadata, safe_extract


class ReleaseManagerTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.filename = "davpanel-2.0.19-linux-amd64.tar.gz"
        self.archive = self.root / self.filename
        with tarfile.open(self.archive, "w:gz") as output:
            body = b"raise SystemExit(0)\n"
            entry = tarfile.TarInfo("scripts/preflight.py")
            entry.size = len(body)
            output.addfile(entry, io.BytesIO(body))
        checksum = hashlib.sha256(self.archive.read_bytes()).hexdigest()
        self.checksum = self.root / (self.filename + ".sha256")
        self.checksum.write_text(f"{checksum}  {self.filename}\n")
        self.release = {"tag_name": "v2.0.19", "assets": [
            {"name": self.filename, "browser_download_url": self.archive.as_uri()},
            {"name": self.filename + ".sha256", "browser_download_url": self.checksum.as_uri()},
        ]}

    def test_verified_release_is_cached_without_modifying_installed_files(self):
        cache = self.root / "cache"
        source = fetch_release(self.release, "2.0.19", "amd64", cache)
        self.assertTrue((source / "scripts/preflight.py").is_file())
        self.assertEqual(source, fetch_release(self.release, "2.0.19", "amd64", cache))
        self.assertEqual(cache.stat().st_mode & 0o777, 0o700)

    def test_corrupted_archive_is_rejected_before_extraction(self):
        self.archive.write_bytes(self.archive.read_bytes() + b"corrupt")
        with self.assertRaisesRegex(ValueError, "checksum mismatch"):
            fetch_release(self.release, "2.0.19", "amd64", self.root / "cache")
        self.assertFalse(list((self.root / "cache").glob("2.0.19-*")))

    def test_missing_release_assets_fail_before_downloading(self):
        with self.assertRaisesRegex(ValueError, "not available"):
            fetch_release({"assets": []}, "2.0.19", "amd64", self.root / "cache")

    def test_component_checksum_cannot_name_another_file(self):
        self.checksum.write_text("a" * 64 + "  ../../outside\n")
        with self.assertRaisesRegex(ValueError, "checksum file"):
            fetch_release(self.release, "2.0.19", "amd64", self.root / "cache")

    def test_archive_links_are_rejected(self):
        archive = self.root / "unsafe.tar.gz"
        with tarfile.open(archive, "w:gz") as output:
            entry = tarfile.TarInfo("linked")
            entry.type, entry.linkname = tarfile.SYMTYPE, "/etc"
            output.addfile(entry)
        with self.assertRaisesRegex(ValueError, "links and special"):
            safe_extract(archive, self.root / "extracted")

    def test_release_api_rejects_invalid_repository_before_network_access(self):
        with self.assertRaisesRegex(ValueError, "repository"):
            release_metadata("https://api.github.com", "../../bad")
