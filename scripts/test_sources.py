import json
import subprocess
import tempfile
import unittest
from pathlib import Path

from audit_sources import REQUIRED, inspect_sources
from preflight import check_artifacts
from runtime_contracts import check_contracts


class SourceAuditTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        (self.root / "davpanel").mkdir()
        (self.root / "davpanel/go.mod").write_text("module example.test/davpanel\n")
        components = []
        for name in sorted(REQUIRED):
            directory = self.root / name
            directory.mkdir(parents=True)
            (directory / "FORK.md").write_text("Upstream source attribution.\n")
            (directory / "source.txt").write_text("source\n")
            components.append({"path": name, "upstream_commit": "a" * 40})
        (self.root / "components.lock.json").write_text(json.dumps({
            "schema_version": 1, "maintainer": "kangpcode", "components": components,
        }))
        inspect_sources(self.root, refresh=True)

    def test_complete_inventory_and_actual_reference_detection(self):
        reference = self.root / "openpanel-main/openpanel"
        reference.mkdir(parents=True)
        (reference / "go.mod").write_text("module upstream\n")
        report = inspect_sources(self.root)
        self.assertTrue(report["source_inventory_complete"])
        self.assertEqual(report["primary_reference_type"], "hosting-go")

    def test_tampered_source_and_executable_mode_are_detected(self):
        source = self.root / "davcli/source.txt"
        source.write_text("tampered\n")
        self.assertFalse(inspect_sources(self.root)["source_inventory_complete"])
        inspect_sources(self.root, refresh=True)
        source.chmod(0o755)
        self.assertFalse(inspect_sources(self.root)["source_inventory_complete"])

    def test_empty_component_and_missing_manifest_entry_fail(self):
        (self.root / "davadmin/source.txt").unlink()
        self.assertFalse(inspect_sources(self.root)["source_inventory_complete"])
        with self.assertRaises(ValueError):
            inspect_sources(self.root, refresh=True)
        manifest = self.root / "components.lock.json"
        data = json.loads(manifest.read_text())
        data["components"].pop()
        manifest.write_text(json.dumps(data))
        self.assertFalse(inspect_sources(self.root)["source_inventory_complete"])

    def test_manifest_path_escape_is_rejected(self):
        manifest = self.root / "components.lock.json"
        data = json.loads(manifest.read_text())
        data["components"][0]["path"] = "../outside"
        manifest.write_text(json.dumps(data))
        with self.assertRaises(ValueError):
            inspect_sources(self.root)

    def test_release_requires_real_binaries_and_checksums(self):
        directory = self.root / "bin"
        directory.mkdir()
        (directory / "davadmin-amd64").write_text("404 not found\n")
        errors = check_artifacts(self.root, "amd64")
        self.assertTrue(any("ELF" in error for error in errors))
        self.assertTrue(any("Missing binary" in error for error in errors))
        self.assertTrue(any("checksums" in error for error in errors))

    def test_sourcing_installer_does_not_run_installation(self):
        installer = Path(__file__).resolve().parents[1] / "PODMAN_INSTALL.sh"
        result = subprocess.run(["bash", "-c", 'source "$1"; declare -F download_files', "bash", str(installer)],
                                capture_output=True, text=True, cwd=self.root)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.strip(), "download_files")
        self.assertEqual(list(self.root.glob("*.log")), [])

    def test_runtime_contracts_reject_missing_inputs(self):
        errors = check_contracts(self.root)
        self.assertTrue(errors)
        self.assertTrue(any("CLI wrappers" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
