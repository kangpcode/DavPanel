import io
import os
import subprocess
import tarfile
import tempfile
import unittest
from pathlib import Path

from make_installer import make_installer


ROOT = Path(__file__).resolve().parents[1]


class StandaloneInstallerTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.archive = self.root / "release.tar.gz"
        self.installer = self.root / "release.run"
        self.environment = dict(os.environ, TMPDIR=str(self.root))

    def build(self, extra=None):
        with tarfile.open(self.archive, "w:gz") as archive:
            files = {
                "PODMAN_INSTALL.sh": b'#!/bin/bash\nprintf "VERIFIED %s\\n" "$*"\n',
                "scripts/preflight.py": b"# fixture\n",
            }
            for name, body in files.items():
                entry = tarfile.TarInfo(name)
                entry.size, entry.mode = len(body), 0o755
                archive.addfile(entry, io.BytesIO(body))
            if extra is not None:
                archive.addfile(extra)
        make_installer(self.archive, self.installer, ROOT / "install.sh")

    def run_installer(self, *arguments):
        return subprocess.run(["bash", str(self.installer), *arguments], capture_output=True,
                              text=True, env=self.environment, timeout=15)

    def test_standalone_verifies_and_extracts_release_for_read_only_preflight(self):
        self.build()
        result = self.run_installer("--preflight")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("VERIFIED --source-dir=", result.stdout)
        self.assertIn("--preflight", result.stdout)
        self.assertEqual(list(self.root.glob("davpanel-installer.*")), [])

    def test_damaged_payload_cannot_execute_its_installer(self):
        self.build()
        payload = bytearray(self.installer.read_bytes())
        payload[-1] ^= 1
        self.installer.write_bytes(payload)
        result = self.run_installer("--preflight")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("checksum mismatch", result.stderr)
        self.assertNotIn("VERIFIED", result.stdout)
        self.assertEqual(list(self.root.glob("davpanel-installer.*")), [])

    def test_archive_paths_cannot_escape_temporary_directory(self):
        self.build(tarfile.TarInfo("../../escaped"))
        result = self.run_installer("--preflight")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Unsafe release archive path", result.stderr)
        self.assertNotIn("VERIFIED", result.stdout)

    def test_archive_links_are_rejected(self):
        link = tarfile.TarInfo("scripts/link")
        link.type, link.linkname = tarfile.SYMTYPE, "/etc"
        self.build(link)
        result = self.run_installer("--preflight")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("links or special files", result.stderr)

    def test_duplicate_archive_members_are_rejected(self):
        self.build(tarfile.TarInfo("PODMAN_INSTALL.sh"))
        result = self.run_installer("--preflight")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Duplicate release archive path", result.stderr)

    def test_help_does_not_extract_or_execute_payload(self):
        self.build()
        result = self.run_installer("--help")
        self.assertEqual(result.returncode, 0)
        self.assertIn("kangpcode", result.stdout)
        self.assertNotIn("VERIFIED", result.stdout)
        self.assertEqual(list(self.root.glob("davpanel-installer.*")), [])


if __name__ == "__main__":
    unittest.main()
