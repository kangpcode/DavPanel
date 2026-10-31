# DavPanel implementation audit

Date: 2026-10-31. Fork developer: **Dhafa Nazula Permadi (kangpcode)**.

## Source and build

The supplied `openpanel-main/` is the Go hosting panel reference. Every file
under its `openpanel/` has a corresponding renamed path under `davpanel/`.
The reference itself was retained untouched.

All 16 formerly empty components now contain source. `components.lock.json`
records upstream commit pins and hashes of the modified component trees;
`FORK.md` records provenance in each component. These are vendored directories,
so a fresh checkout does not need unpublished fork repositories or submodules.
Ten component license/notice files were compared byte for byte with the fetched
source and preserved. Developer identity in product UI and package metadata is
kangpcode; original legal notices remain with their source.

The release builder compiles static Linux panel/admin binaries, checks shared
runtime config paths, and produces a source installation archive plus checksums.
`BUILD.json` binds the binaries to source-tree digests, allowing preflight to
reject stale binaries. The release installer uses local inputs and builds its
panel, Caddy/Coraza, FTP and Tor images; the missing `encoded-*` input and Gunicorn
service dependency have been removed. Optional installer steps return success
when skipped, required step failures stop installation, and the installer checks
MySQL availability and the running panel's health before completing.

## Additional fixes for the standalone installer

- `install.sh` and the release builder now produce a self-extracting `.run`.
  A single `sudo bash <release>.run` verifies and installs the bundled release.
  Payload corruption, archive traversal, duplicate members and special files are
  rejected before executing the bundled installer. `--preflight` changes no services.
- Both Go modules select Go 1.27.3. The original Go 1.27.0 compiler triggered
  standard-library findings; rescanning with the patched compiler reports no
  reachable vulnerabilities in either module. Each scan still reports one issue
  in an imported package and one module issue without a vulnerable call path;
  this does not establish that the complete system has no vulnerabilities.
- Browser SSO and JWT credential login both enforce TOTP for enabled accounts.
  SSO redemption rejects changed TOTP settings; disabled/deleted accounts cannot
  retain bare-token API access. The mobile app opens interactive login for 2FA.
- Unverified Enterprise-shaped keys no longer bypass panel validation. Admin
  offline grace caches are private, bound to the key/IP, and cannot override an
  explicit expiry response. The license endpoint remains configurable.
- Redis socket directories use mode 0700 with the image's Redis UID/GID.
  Sentinel preserves those permissions through systemd-tmpfiles.
- The firewall helper uses bundled source. Invalid ports, usernames and domains
  are rejected before installation; install logs are kept root-readable at a
  fixed absolute path. No terminal is required to display generated credentials.
- MySQL credentials are stored mode 0600. The metadata database now uses
  MariaDB 11.4 because the inherited `10-focal` tag resolved to MariaDB 10.7.3.
- Completion checks include the admin service, core containers, optional DNS,
  the Redis socket and the panel health endpoint. These checks run on the target
  server; they are not a substitute for the clean-VPS acceptance test below.

## GitHub, platforms and comparison

GitHub releases are now the single update source for panel/admin binaries, CLI,
configuration, translations and bundled migration scripts. Downloads verify SHA-256
and rerun source/binary preflight before installed files can be replaced. The
installer no longer queries the placeholder statistics API to choose its version.
Locale installation and reporting helpers use bundled source. Reset/default
configuration URLs use this monorepo rather than unpublished component forks.

The Codespaces/dev-container configuration and `scripts/dev.sh` provide source
checks, Go tests, vulnerability scanning, release builds and documentation preview.
A hosted Codespace has not been launched here. `PLATFORMS.md` records the actual
Linux hosting boundary, experimental distributions and workstation development.
Native Windows/macOS hosting and universal OS support are not implemented.

`BENCHMARKS.md` compares all six products against current official documentation
and supplies a reproducible measurement procedure. `benchmarks/collect.py`
collects raw HTTP measurements from operator-supplied test endpoints. No competitor
performance scores have been invented or measured in this workspace.

## Validation

| Check | Result |
| --- | --- |
| DavPanel `go test ./...` | Passed |
| DavAdmin `go test ./...` | Passed |
| Source integrity and shared runtime contracts | Passed for all 16 components |
| Installer, release manager, update failure and benchmark regression tests | 27 passed |
| Component Bash/PHP syntax | 148 Bash scripts and 22 PHP files passed |
| Local panel, Caddy/Coraza, FTP and Tor image builds | Passed on linux/amd64; Tor configuration validated |
| Panel container `/healthz` and `/login` | Passed with dummy configuration and no external network |
| Caddy module check | `http.handlers.waf` and `http.handlers.rate_limit` present |
| FTP image inputs | vsftpd, pidproxy and startup script present |
| Release extraction and `--preflight` | Standalone amd64 installer passed outside the checkout; arm64 archive passed architecture/source/binary verification without native execution |
| DavAdmin API endpoint export | Passed from the built binary |
| Mobile TypeScript `tsc --noEmit` | Passed |
| Redis restricted socket directory | Passed in an isolated Redis container |
| Metadata schema on MariaDB 11.4.13 | Five tables and two bundled plans initialized in an isolated container |
| Go runtime dependency scan on Go 1.27.3 | No reachable vulnerabilities reported for both modules |
| Website production build | Passed after fixing six invalid redirect targets and the React peer dependency |

The container smoke test proves startup and login rendering. It does not exercise
real MySQL data, account provisioning, tenant isolation, or a full hosting stack.
The disposable smoke container was removed after the check.

## Remaining release gates

- Run a clean-server installation on a disposable supported VPS and verify admin
  login, user creation, PHP/database provisioning, DNS/TLS, FTP, backups/restore
  and API operations. No host installation was run in this workspace.
- Billing integrations need their actual provider platforms. Mobile signing,
  Android/iOS builds and device authentication remain unverified; the upstream
  Expo cloud project association was removed from the fork.
- Published domains, standalone fork releases and registry availability are
  separate deployment tasks. The local source installation does not require
  those component releases. Remote updating still requires published artifacts.
- npm advisory scans reported **26 website findings** (0 high/critical, 23 moderate, 3 low) and
  **16 mobile findings** (3 high, 9 moderate, 4 low), including transitive tooling
  dependencies. The website's `follow-redirects` findings were patched; the
  Expo CLI's nested Zod 3 dependency remains among the mobile findings. These counts include propagated dependency
  findings and do not establish exploitability in a deployed panel. They remain
  open; no forced framework downgrades or incompatible dependency overrides were
  applied. npm dependencies are excluded from the server installation archive.

This is a source, integration and packaging audit. It does not certify complete
feature parity with every external service, a production deployment, or the
absence of security vulnerabilities. Installation instructions are in `INSTALL.md`.
