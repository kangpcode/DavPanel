"""Exercise online installer paths without network access or host installation."""

import hashlib
import io
import json
import os
import subprocess
import tarfile
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class BootstrapTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        self.bin = self.root / "bin"
        self.bin.mkdir()
        self.log = self.root / "commands.jsonl"
        self.payload = b'#!/bin/bash\nprintf "INSTALLED <%s>\\n" "$@"\n'
        (self.root / "installer.run").write_bytes(self.payload)
        assets = [f"davpanel-2.0.19-linux-{arch}.run{suffix}"
                  for arch in ("amd64", "arm64") for suffix in ("", ".sha256")]
        self.release = {"tag_name": "v2.0.19", "assets": [{"name": name} for name in assets]}
        self.save_release()
        self.environment = dict(os.environ, PATH=f"{self.bin}:/usr/bin:/bin", TMPDIR=str(self.root),
                                FIXTURE=str(self.root), BOOTSTRAP=str(ROOT / "bootstrap.sh"))
        self.environment.pop("DAVPANEL_REPOSITORY", None)
        self.environment.pop("DAVPANEL_SOURCE_REF", None)
        self.environment.pop("CODESPACES", None)
        self.executable("curl", '''#!/usr/bin/python3
import hashlib, json, os, shutil, sys
from pathlib import Path
root = Path(os.environ["FIXTURE"])
args = sys.argv[1:]
with (root / "commands.jsonl").open("a") as log:
    log.write(json.dumps(["curl", *args]) + "\\n")
url = next(arg for arg in args if arg.startswith("https://"))
target = Path(args[args.index("-o") + 1])
if "api.github.com" in url:
    target.write_text((root / "release.json").read_text())
    print(os.environ.get("RELEASE_STATUS", "200"), end="")
elif "go.dev/dl/?" in url:
    shutil.copyfile(root / "go.json", target)
elif "go.dev/dl/" in url:
    shutil.copyfile(root / "go.tar.gz", target)
elif url.endswith(".sha256"):
    digest = os.environ.get("RELEASE_DIGEST", hashlib.sha256((root / "installer.run").read_bytes()).hexdigest())
    target.write_text(digest + "  " + url.rsplit("/", 1)[1][:-7] + "\\n")
else:
    shutil.copyfile(root / "installer.run", target)
''')
        self.executable("uname", '#!/bin/bash\nif [[ "$1" == -s ]]; then echo Linux; else echo "${CPU:-x86_64}"; fi\n')
        self.executable("sudo", '#!/bin/bash\nexec "$@"\n')
        # No host package manager may run, even if a regression requests one.
        for manager in ("apt-get", "dnf", "yum"):
            self.executable(manager, '#!/bin/bash\necho "UNEXPECTED PACKAGE INSTALL" >&2\nexit 99\n')
        self.executable("go", '#!/bin/bash\necho "go version go${GO_VERSION:-1.27.3} linux/amd64"\n')
        self.source = self.root / "source-fixture"
        for directory in ("scripts", "davadmin", "davpanel"):
            (self.source / directory).mkdir(parents=True)
        for component in ("davadmin", "davpanel"):
            (self.source / component / "go.mod").write_text("module fixture\n\ntoolchain go1.27.3\n")
        (self.source / "davpanel/version").write_text("2.0.19\n")
        (self.source / "scripts/audit_sources.py").write_text('print("SOURCE VERIFIED")\n')
        (self.source / "scripts/build-release.sh").write_text('''#!/bin/bash
set -eu
root=$(cd -- "$(dirname -- "$0")/.." && pwd)
[[ "${FAIL_BUILD:-false}" != true ]] || exit 42
mkdir -p "$root/dist"
cp "$FIXTURE/installer.run" "$root/dist/davpanel-2.0.19-linux-${1#--arch=}.run"
echo "BUILD VERIFIED $(go version)"
''')
        self.executable("git", '''#!/usr/bin/python3
import json, os, shutil, sys
from pathlib import Path
root = Path(os.environ["FIXTURE"])
with (root / "commands.jsonl").open("a") as log:
    log.write(json.dumps(["git", *sys.argv[1:]]) + "\\n")
shutil.copytree(root / "source-fixture", sys.argv[-1])
''')

    def executable(self, name, content):
        path = self.bin / name
        path.write_text(content)
        path.chmod(0o755)

    def save_release(self):
        (self.root / "release.json").write_text(json.dumps(self.release))

    def run_bootstrap(self, *arguments, process_substitution=False, **environment):
        command = (["bash", "-c", 'bash <(cat "$BOOTSTRAP") "$@"', "fixture"]
                   if process_substitution else ["bash", "-c", '''source "$BOOTSTRAP"
bootstrap_in_container() { [[ "${FIXTURE_CONTAINER:-false}" == true ]]; }
main "$@"
''', "fixture"])
        result = subprocess.run([*command, *arguments], env=dict(self.environment, **environment),
                                text=True, capture_output=True, timeout=20)
        self.assertEqual(list(self.root.glob("davpanel-download.*")), [], result.stderr)
        return result

    def commands(self):
        return [json.loads(line) for line in self.log.read_text().splitlines()] if self.log.exists() else []

    def make_go_archive(self, corrupt=False):
        with tarfile.open(self.root / "go.tar.gz", "w:gz") as archive:
            body = b'#!/bin/bash\necho "go version go1.27.3 linux/amd64 (downloaded)"\n'
            entry = tarfile.TarInfo("go/bin/go")
            entry.size, entry.mode = len(body), 0o755
            archive.addfile(entry, io.BytesIO(body))
        digest = hashlib.sha256((self.root / "go.tar.gz").read_bytes()).hexdigest()
        (self.root / "go.json").write_text(json.dumps([{"stable": True, "files": [{
            "filename": "go1.27.3.linux-amd64.tar.gz", "sha256": "0" * 64 if corrupt else digest,
        }]}]))

    def test_published_release_is_verified_and_receives_all_options(self):
        result = self.run_bootstrap("--domain=panel.example.com", "--password=with spaces")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("INSTALLED <--domain=panel.example.com>", result.stdout)
        self.assertIn("INSTALLED <--password=with spaces>", result.stdout)
        self.assertFalse(any(command[0] == "git" for command in self.commands()))

    def test_process_substitution_and_arm64(self):
        result = self.run_bootstrap("--preflight", process_substitution=True, CPU="aarch64")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("INSTALLED <--preflight>", result.stdout)
        self.assertTrue(any("davpanel-2.0.19-linux-arm64.run" in arg
                            for command in self.commands() for arg in command))

    def test_container_installation_stops_before_downloads_or_builds(self):
        for arguments in ((), ("--from-source",), ("--repair",), ("--skip-requirements",)):
            with self.subTest(arguments=arguments):
                result = self.run_bootstrap(*arguments, FIXTURE_CONTAINER="true")
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("clean Linux VM/VPS", result.stderr)
                self.assertIn("bash scripts/dev.sh build", result.stderr)
                self.assertEqual(self.commands(), [])
                self.assertNotIn("BUILD VERIFIED", result.stdout)
                self.assertNotIn("INSTALLED", result.stdout)
                self.assertNotIn("UNEXPECTED PACKAGE INSTALL", result.stderr)

    def test_codespaces_container_is_detected_by_the_entrypoint(self):
        result = self.run_bootstrap(process_substitution=True, CODESPACES="true")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("clean Linux VM/VPS", result.stderr)
        self.assertEqual(self.commands(), [])

    def test_read_only_verification_is_available_in_containers(self):
        for option in ("--preflight", "--dry-run"):
            with self.subTest(option=option):
                result = self.run_bootstrap(option, FIXTURE_CONTAINER="true")
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn(f"INSTALLED <{option}>", result.stdout)
                self.assertFalse(any(command[0] == "git" for command in self.commands()))

    def test_no_release_automatically_builds_and_installs_source(self):
        result = self.run_bootstrap("--domain=panel.example.com", RELEASE_STATUS="404")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("SOURCE VERIFIED", result.stdout)
        self.assertIn("BUILD VERIFIED", result.stdout)
        self.assertIn("INSTALLED <--domain=panel.example.com>", result.stdout)
        self.assertTrue(any("--branch=main" in command for command in self.commands()))

    def test_incomplete_release_uses_source(self):
        self.release["assets"] = []
        self.save_release()
        result = self.run_bootstrap()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("BUILD VERIFIED", result.stdout)

    def test_explicit_source_skips_release_api(self):
        result = self.run_bootstrap("--from-source", DAVPANEL_SOURCE_REF="testing")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(any("--branch=testing" in command for command in self.commands()))
        self.assertFalse(any(command[0] == "curl" for command in self.commands()))

    def test_missing_version_uses_requested_source_tag(self):
        result = self.run_bootstrap("--version=2.0.19", RELEASE_STATUS="404")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(any("--branch=v2.0.19" in command for command in self.commands()))
        self.assertIn("INSTALLED <--version=2.0.19>", result.stdout)

    def test_old_go_is_replaced_by_verified_temporary_toolchain(self):
        self.make_go_archive()
        result = self.run_bootstrap(RELEASE_STATUS="404", GO_VERSION="1.20.0")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("go1.27.3 linux/amd64 (downloaded)", result.stdout)

    def test_damaged_go_download_cannot_build_or_install(self):
        self.make_go_archive(corrupt=True)
        result = self.run_bootstrap(RELEASE_STATUS="404", GO_VERSION="1.20.0")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Go toolchain checksum mismatch", result.stderr)
        self.assertNotIn("BUILD VERIFIED", result.stdout)
        self.assertNotIn("INSTALLED", result.stdout)

    def test_release_checksum_failure_does_not_fall_back_to_source(self):
        result = self.run_bootstrap(RELEASE_DIGEST="0" * 64)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Checksum mismatch", result.stderr)
        self.assertNotIn("INSTALLED", result.stdout)
        self.assertFalse(any(command[0] == "git" for command in self.commands()))

    def test_read_only_without_release_cannot_build_or_install(self):
        for option in ("--preflight", "--dry-run"):
            with self.subTest(option=option):
                result = self.run_bootstrap(option, RELEASE_STATUS="404")
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("no build or installation was attempted", result.stderr)
                self.assertFalse(any(command[0] == "git" for command in self.commands()))

    def test_build_failure_cannot_start_installation(self):
        result = self.run_bootstrap(RELEASE_STATUS="404", FAIL_BUILD="true")
        self.assertEqual(result.returncode, 42, result.stderr)
        self.assertNotIn("INSTALLED", result.stdout)

    def test_api_server_error_cannot_trigger_installation(self):
        result = self.run_bootstrap(RELEASE_STATUS="500")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("HTTP 500", result.stderr)
        self.assertNotIn("INSTALLED", result.stdout)

    def test_help_and_invalid_input_do_not_access_network(self):
        for arguments in (("--help",), ("--version=../../bad",)):
            with self.subTest(arguments=arguments):
                result = self.run_bootstrap(*arguments)
                self.assertEqual(result.returncode, 0 if arguments[0] == "--help" else 1)
                self.assertEqual(self.commands(), [])

    def test_missing_dependencies_are_installed_with_supported_package_managers(self):
        for manager in ("apt-get", "dnf", "yum"):
            with self.subTest(manager=manager):
                marker = self.root / "dependencies-installed"
                marker.unlink(missing_ok=True)
                self.executable(manager, '''#!/bin/bash
printf '%s\\n' "$*" >> "$FIXTURE/packages.log"
if [[ "$1" == install ]]; then touch "$FIXTURE/dependencies-installed"; fi
''')
                script = '''source "$BOOTSTRAP"
read_only=false
root_command=(sudo)
command() {
    if [[ "$1" == -v ]]; then
        case "$2" in
            fixture-dependency) [[ -f "$FIXTURE/dependencies-installed" ]]; return ;;
            apt-get|dnf|yum) [[ "$2" == "$PACKAGE_MANAGER" ]]; return ;;
        esac
    fi
    builtin command "$@"
}
bootstrap_dependencies fixture-dependency
'''
                result = subprocess.run(["bash", "-c", script], capture_output=True, text=True,
                                        env=dict(self.environment, PACKAGE_MANAGER=manager), timeout=15)
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertTrue(marker.exists())
                self.assertIn("ca-certificates curl coreutils tar gzip python3 git",
                              (self.root / "packages.log").read_text())

    def test_read_only_does_not_install_missing_dependencies(self):
        result = subprocess.run(["bash", "-c", '''source "$BOOTSTRAP"
read_only=true
root_command=()
bootstrap_dependencies fixture-missing-command
'''], env=self.environment, capture_output=True, text=True, timeout=15)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Read-only verification requires", result.stderr)
        self.assertNotIn("UNEXPECTED PACKAGE INSTALL", result.stderr)


if __name__ == "__main__":
    unittest.main()
