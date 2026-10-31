import re
import subprocess
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def function(name):
    source = (ROOT / "davcli/update.sh").read_text()
    match = re.search(r"^" + name + r"\(\) \{.*?^\}", source, re.M | re.S)
    if not match:
        raise AssertionError("Updater function missing: " + name)
    return match.group()


class UpdateFailureTests(unittest.TestCase):
    def test_failed_component_stops_later_modes_and_preserves_exit_code(self):
        script = function("main") + "\n" + """
update_modules() { return 42; }
update_davpanel() { echo 'MUST_NOT_RUN'; }
main --modules --panel
exit $?
"""
        result = subprocess.run(["bash", "-c", script], capture_output=True, text=True)
        self.assertEqual(result.returncode, 42, result.stderr)
        self.assertNotIn("MUST_NOT_RUN", result.stdout)

    def test_successful_component_returns_zero_without_cleanup_directory(self):
        script = function("main") + "\nupdate_modules() { return 0; }; main --modules"
        self.assertEqual(subprocess.run(["bash", "-c", script]).returncode, 0)

    def test_only_bundled_migrations_in_version_range_execute(self):
        with tempfile.TemporaryDirectory() as directory:
            for version in ("2.0.18", "2.0.19", "2.0.20", "2.0.21", "unversioned"):
                (Path(directory) / "UPDATES" / version).mkdir(parents=True)
            script = function("compare_versions") + "\n" + function("run_version_specific_scripts_in_range") + "\n" + """
davpanel_release_source() { printf '%s' "$FIXTURE"; }
log_info() { :; }
run_version_specific_script() { echo "$1"; }
"""
            script += '\nFIXTURE="$1"; run_version_specific_scripts_in_range 2.0.18 2.0.20'
            result = subprocess.run(["bash", "-c", script, "test", directory], capture_output=True, text=True)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stdout.splitlines(), ["2.0.19", "2.0.20"])
