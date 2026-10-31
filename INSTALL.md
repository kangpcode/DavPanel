# Install DavPanel from this source tree

Developer and maintainer: **Dhafa Nazula Permadi (kangpcode)**.

The checkout includes all 16 component sources. `components.lock.json` records
their upstream commits and SHA-256 digests after fork changes. They are ordinary
vendored directories; no submodule initialization or unpublished fork repositories
are needed. The original `openpanel-main/` directory is a read-only reference and
is excluded from releases.

## Build a release

On a build machine with Go 1.26 or newer, Python 3, Bash, tar and sha256sum:

```bash
python3 scripts/audit_sources.py
bash scripts/build-release.sh --arch=amd64
```

Use `--arch=arm64` for AArch64. This builds both panel binaries directly from
source with CGO disabled and packages the runtime inputs and corresponding source
in `dist/davpanel-<version>-linux-<arch>.tar.gz`. No images or files are published.

## Validate and install

Copy the release archive to a **clean dedicated Linux server**, extract it, and
enter its directory. Supported systems follow the installer: Ubuntu, Debian,
AlmaLinux, Rocky Linux, CentOS and Oracle Linux, amd64 or arm64.

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
importers. It builds the panel, Caddy/Coraza and FTP container images locally,
using the release binary for the panel image, then configures system services.
Internet access is needed for OS packages and base/third-party container images.
The build does not require `api.davpanel.com` or standalone `kangpcode/*` releases.
Run the installer only on the target hosting server: it changes system packages,
networking, firewall, quotas, system services and `/etc/davpanel`.

Default endpoints: DavPanel `https://SERVER:2083`, DavAdmin `https://SERVER:2087`.
The installer prints the generated administrator credentials. Use `--domain=`
with working DNS to obtain public TLS certificates.

## Updates and hosted services

Standalone remote updates need published DavPanel images and DavAdmin releases.
Until those exist, build a reviewed release and test its upgrade on a disposable
server. Do not use the clean-server installer to upgrade a populated server.

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
