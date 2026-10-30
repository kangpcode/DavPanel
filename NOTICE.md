# NOTICE

## DavPanel fork

**DavPanel** is a rebranded fork of **OpenPanel** (<https://github.com/stefanpejcic/OpenPanel>).

- Fork maintained by: **Dhafa Nazula Permadi** (`kangpcode`) <kangpcode@users.noreply.github.com>
- DavPanel repository: <https://github.com/kangpcode/DavPanel>
- Fork year: 2026

## Upstream copyright

The upstream project, its source code, documentation, trademarks and all original
copyright notices are the property of their respective authors, including:

- **Stefan Pejcic** and the OpenPanel contributors
- **OpenPanel, LLC** ("OpenPanel" and the OpenPanel logo are trademarks of OpenPanel, LLC)

Those notices are retained in [LICENSE](LICENSE), in source headers, and in the
documentation and marketing pages that predate this fork. Nothing in this fork
transfers or claims ownership of the upstream work.

## What this fork changes

This fork is a source-level rebrand. The following identifiers were renamed
consistently across the codebase, installer, update scripts and configuration
references:

| Upstream | DavPanel fork |
| -------- | ------------- |
| OpenPanel / openpanel | DavPanel / davpanel |
| OpenAdmin / openadmin | DavAdmin / davadmin |
| OpenCLI / opencli | DavCLI / davcli |
| `/etc/openpanel/` | `/etc/davpanel/` |
| `/var/log/openpanel/` | `/var/log/davpanel/` |
| `/usr/local/opencli/` | `/usr/local/davcli/` |
| `/usr/local/admin/` | `/usr/local/davadmin/` |
| `openpanel.config` | `davpanel.config` |
| `OPENPANEL` session cookie | `DAVPANEL` session cookie |
| Go module `gist.github.com/stefanpejcic/openpanel` | `github.com/kangpcode/davpanel` |
| `docker.io/openpanel/*` images | `ghcr.io/kangpcode/*` images |
| `openpanel-screenshots` / `openadmin-screenshots` assets | `davpanel-screenshots` / `davadmin-screenshots` |

Service endpoints that were hardcoded to the project's hosted API are also
overridable for self-hosting:

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `DAVPANEL_PHP_VERSIONS_API` | `https://api.davpanel.com/php-versions/` | PHP version metadata badges |
| `DAVPANEL_SCREENSHOTS_API` | `https://api.davpanel.com/screenshots` | Website screenshot fallback |
| `DAVPANEL_LICENSE_API` | `https://api.davpanel.com/enterprise/index.php` | Enterprise license validation |

The license-key verification and Enterprise feature gating are **not** removed,
disabled or bypassed. Commercial terms remain those of the upstream EULA.

## Third-party components

Vendored front-end libraries under `davpanel/static/vendor/` (Bootstrap Icons,
Alpine.js, CodeMirror, Monaco, Chart.js, driver.js, GrapesJS, Swagger UI, xterm,
and others) and Go modules listed in `davpanel/go.mod` remain under their own
licenses and copyright holders. See the license file shipped with each component.

## Historical references

Some code comments and historical changelog entries intentionally still link to
upstream OpenPanel issues, pull requests and commits. Those links are citations of
the upstream history and are not an endorsement by, or affiliation with, OpenPanel, LLC.
