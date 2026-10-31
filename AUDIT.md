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
panel, Caddy/Coraza and FTP images; the missing `encoded-*` input and Gunicorn
service dependency have been removed. Optional installer steps return success
when skipped, required step failures stop installation, and the installer checks
MySQL availability and the running panel's health before completing.

## Validation

| Check | Result |
| --- | --- |
| DavPanel `go test ./...` | Passed |
| DavAdmin `go test ./...` | Passed |
| Source integrity and shared runtime contracts | Passed for all 16 components |
| Release/installer regression tests | 9 passed |
| Component Bash/PHP syntax | 141 Bash scripts and 22 PHP files passed |
| Local panel, Caddy/Coraza and FTP image builds | Passed on linux/amd64 |
| Panel container `/healthz` and `/login` | Passed with dummy configuration and no external network |
| Caddy module check | `http.handlers.waf` and `http.handlers.rate_limit` present |
| FTP image inputs | vsftpd, pidproxy and startup script present |
| Release extraction and `--preflight` | Passed independently of the build checkout |
| DavAdmin API endpoint export | Passed from the built binary |
| Mobile TypeScript `tsc --noEmit` | Passed |
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
- Existing `davpanel/internal/app/license.go` accepts Enterprise-shaped key
  prefixes in `LicenseCheckPasses` before consulting `LicenseValid`. This
  inherited behavior was retained; license enforcement is not certified here.
- Existing `davadmin/internal/handlers/api_login.go` permits password-only SSO
  without a TOTP challenge, as its implementation comment states. Review that
  behavior before claiming that all admin session flows enforce two-factor auth.
- npm advisory scans reported **24 website findings** (21 high, 3 low) and
  **16 mobile findings** (3 high, 9 moderate, 4 low), including transitive tooling
  dependencies. Examples are the website's pinned `follow-redirects` and the
  Expo CLI's nested Zod 3 dependency. These counts include propagated dependency
  findings and do not establish exploitability in a deployed panel. They remain
  open; no forced framework downgrades or incompatible dependency overrides were
  applied. npm dependencies are excluded from the server installation archive.

This is a source, integration and packaging audit. It does not certify complete
feature parity with every external service, a production deployment, or the
absence of security vulnerabilities. Installation instructions are in `INSTALL.md`.
