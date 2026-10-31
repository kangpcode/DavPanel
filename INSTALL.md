# Install DavPanel from this source tree

Developer and maintainer: **Dhafa Nazula Permadi (kangpcode)**.

## One-command installation

Copy the standalone release installer to a clean target VPS and run:

```bash
sudo bash davpanel-2.0.19-linux-amd64.run
```

For AArch64, use the `linux-arm64.run` release. The file includes both panel
binaries, the 16 component sources and installation inputs; no Go compiler,
manual archive extraction or separate build step is required on the target.
The installer requires Python 3.9+ as `python3`. It verifies its payload SHA-256, rejects archive path traversal and
links, checks the component/source/binary digests and architecture, then starts
the hosting installation. It installs Python 3 if absent. It still downloads OS
packages, base container images and external firewall/WAF dependencies.

With no `--domain`, it uses a self-signed certificate for IP access. For a domain
with working DNS, pass `--domain=panel.example.com` for public TLS. Run only on a
clean dedicated server; the command changes system configuration and services.

Read-only verification, including from a non-root account:

```bash
bash davpanel-2.0.19-linux-amd64.run --preflight
```

From an extracted release or a checkout with release binaries, the equivalent
single command is `sudo bash install.sh`. A checkout without binaries needs Go
and builds them automatically; the standalone `.run` avoids that requirement.
The full installation log is `/var/log/davpanel/install.log`, readable only by root.

These local artifacts have not been uploaded. After publishing the new source
and release, install online with:

```bash
curl -fsSL https://raw.githubusercontent.com/kangpcode/DavPanel/main/bootstrap.sh -o /tmp/davpanel-bootstrap.sh && sudo bash /tmp/davpanel-bootstrap.sh
```

The bootstrap fetches the latest stable GitHub release for the host CPU and
checks its installer checksum. It fails if no complete release is available.
The release workflow builds,
audits and attaches amd64/arm64 installers. Run it manually with `publish` enabled
to create a draft, upload both architectures and checksums, then publish the
complete release. With `publish` disabled it produces downloadable CI artifacts.

The checkout includes all 16 component sources. `components.lock.json` records
their upstream commits and SHA-256 digests after fork changes. They are ordinary
vendored directories; no submodule initialization or unpublished fork repositories
are needed. The original `openpanel-main/` directory is a read-only reference and
is excluded from releases.

## Build a release

On a build machine with Go, Python 3, Bash, tar and sha256sum:

```bash
python3 scripts/audit_sources.py
bash scripts/build-release.sh --arch=amd64
```

The Go modules select the patched Go 1.27.3 toolchain automatically. Keep
toolchain auto-download enabled or provide a stable Go 1.27.3 or newer compiler.
Use `--arch=arm64` for AArch64. This builds both panel binaries directly from
source with CGO disabled and packages the runtime inputs and corresponding source
in `dist/davpanel-<version>-linux-<arch>.tar.gz` and its self-extracting `.run`
counterpart. Each has a `.sha256` file. No images or files are published by the
local builder.

## Validate and install

Copy the release archive to a **clean dedicated Linux server**, extract it, and
enter its directory. Installer branches cover Debian/Ubuntu and several RPM
systems; actual verification limits and CPU support are in [PLATFORMS.md](PLATFORMS.md).

```bash
sha256sum -c SHA256SUMS
bash PODMAN_INSTALL.sh --preflight
sudo bash PODMAN_INSTALL.sh --selfsigned
```

`--preflight` is read-only and works without root. It verifies all source digests,
the binary architecture, executable bits, release checksums, source build provenance
and the shared config/service identifiers. It does not
certify a running hosting installation. `--help` lists the installer options.
Use `--source-dir=/absolute/path` when the inputs are in another directory.
For a repository checkout, the installer finds binaries under `dist/linux-<arch>/bin`.

The installer copies the local configuration, CLI, translations, mail helpers and
importers. It builds the panel, Caddy/Coraza, FTP and Tor container images locally,
using the release binary for the panel image, then configures system services.
Internet access is needed for OS packages and base/third-party container images.
The build does not require `api.davpanel.com` or standalone `kangpcode/*` releases.
Run the installer only on the target hosting server: it changes system packages,
networking, firewall, quotas, system services and `/etc/davpanel`.

Default endpoints: DavPanel `https://SERVER:2083`, DavAdmin `https://SERVER:2087`.
The installer prints the generated administrator credentials. Use `--domain=`
with working DNS to obtain public TLS certificates.

## Updates and hosted services

Remote updates read `kangpcode/DavPanel` GitHub releases. The release manager
downloads the versioned archive plus checksum, validates its sources and static
binaries, and builds the panel image locally. CLI, admin, configuration,
translations and migration scripts come from that same release. No standalone
component repository or published DavPanel registry image is required. The
private cache is `/var/cache/davpanel/releases`. `davcli update --check` checks
metadata; `davcli update --force` uses the configured update workflow. Upgrade
execution on a populated system remains an acceptance-test gate. Do not use the
clean-server installer to upgrade a populated server.

Community installation uses no Enterprise key. An Enterprise key still requires
a working authorized license service. Set `DAVPANEL_LICENSE_API` consistently for
the panel, admin service and CLI when operating a different service. Optional PHP
version data uses `DAVPANEL_PHP_VERSIONS_API`. Endpoint overrides do not bypass
license validation.

Billing integrations require their respective WHMCS, FOSSBilling, Paymenter,
Clientexec, WISECP or Virtualizor installations. The mobile source requires an
Expo build environment and its own app signing credentials; it is not installed
on the hosting server. Their presence and syntax checks do not certify external
provider compatibility.

Component licenses and original notices remain beside their source. Fork changes
and the DavPanel identity are attributed to kangpcode; see `NOTICE.md`.
