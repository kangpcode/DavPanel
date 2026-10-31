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
| Panel, Caddy and FTP images | Locally built `ghcr.io/kangpcode/*` images |
| `openpanel-screenshots` / `openadmin-screenshots` assets | `davpanel-screenshots` / `davadmin-screenshots` |

Service endpoints that were hardcoded to the project's hosted API are also
overridable for self-hosting:

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `DAVPANEL_PHP_VERSIONS_API` | `https://api.davpanel.com/php-versions/` | PHP version metadata badges |
| `DAVPANEL_SCREENSHOTS_API` | `https://api.davpanel.com/screenshots` | Website screenshot fallback |
| `DAVPANEL_LICENSE_API` | `https://api.davpanel.com/enterprise/index.php` | Enterprise license validation |

The license-key verification and Enterprise feature gating are **not** removed,
disabled or bypassed. Each component remains subject to the license shipped beside its source.

## Third-party components

Vendored front-end libraries under `davpanel/static/vendor/` (Bootstrap Icons,
Alpine.js, CodeMirror, Monaco, Chart.js, driver.js, GrapesJS, Swagger UI, xterm,
and others) and Go modules listed in `davpanel/go.mod` remain under their own
licenses and copyright holders. See the license file shipped with each component.

## Historical references

Some code comments and historical changelog entries intentionally still link to
upstream OpenPanel issues, pull requests and commits. Those links are citations of
the upstream history and are not an endorsement by, or affiliation with, OpenPanel, LLC.

## Vendored component provenance

Copyright (C) 2026 Dhafa Nazula Permadi (kangpcode), for DavPanel fork modifications.
Original copyrights remain with the original authors. `components.lock.json` and
each component's `FORK.md` identify the exact source commits. The current DavAdmin
source carries GPL-3.0-or-later with the exception described in `davadmin/LICENSE`
and `davadmin/COPYING`; these files are retained verbatim. Other components retain
their own LICENSE/COPYING files and embedded notices. The root license reproduces
the original hosting snapshot's terms and does not replace those component licenses.

The optional Tor service still references its upstream `openpanel/torwebsite` image
because its image build source is not included. Third-party service images and
libraries keep their upstream names and licenses.
