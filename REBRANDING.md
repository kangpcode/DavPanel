# DavPanel rebranding audit

Report date: 2026-10-30
Scope: full source-level fork of OpenPanel → **DavPanel**, OpenAdmin → **DavAdmin**, OpenCLI → **DavCLI**
Maintainer: **Dhafa Nazula Permadi** (`kangpcode`) <kangpcode@users.noreply.github.com>

---

## 1. Executive summary

The tree was rebranded as a technical fork, not just a visual reskin:

- Runtime paths, binary names, session cookie, config filename, Go module path, container
  images, installer flow, update/backup paths and website metadata were renamed.
- Display strings in the user panel, admin-facing templates and landing pages were updated.
- A new shield-with-"D" mark replaced the upstream logo across SVG, React, favicon and
  social-card assets.
- Upstream attribution and the upstream EULA/trademark text are preserved in `LICENSE`
  and `NOTICE.md`. License enforcement was not removed or bypassed.
- Current docs, versioned docs, changelogs and blog posts were rebranded in content and
  their files, slugs and sidebar ids renamed; upstream issue/PR citations inside them are
  kept as citations.

**Verification:** `go build ./...` passes, `go test ./...` passes, the installer and every
`UPDATES/*/UPDATE.sh` pass `bash -n`, and the Docusaurus config/sidebar pass
`node --check`. Four archived documentation snippets fail `bash -n`; they failed
identically before the rebrand and were left untouched.

Remaining work is infrastructure, not code: the GitHub org, container registry, domains
and the empty submodule repositories still have to be created (see §8).

---

## 2. Identity and naming

| Layer | Upstream | DavPanel fork |
| ----- | -------- | ------------- |
| Product (user panel) | OpenPanel | **DavPanel** |
| Admin panel | OpenAdmin | **DavAdmin** |
| CLI | OpenCLI / `opencli` | **DavCLI / `davcli`** |
| Repository | `stefanpejcic/OpenPanel` | `kangpcode/DavPanel` |
| Source directories | `openpanel/`, `openadmin/`, `opencli/` | `davpanel/`, `davadmin/`, `davcli/` |
| Go module | `gist.github.com/stefanpejcic/openpanel` | `github.com/kangpcode/davpanel` |
| Panel binary | `/openpanel` | `/davpanel` |

Naming is consistent in prose and code: "DavPanel" is the panel, "DavAdmin" is the
server-administration UI, "DavCLI" is the command-line tool and `davcli` is the executable.

---

## 3. Runtime identifier mapping

| Upstream | Fork | Where |
| -------- | ---- | ----- |
| `/etc/openpanel/` | `/etc/davpanel/` | app config, modules, installer, FTP, Matomo, Caddy |
| `/var/log/openpanel/` | `/var/log/davpanel/` | log rotation, installer, templates |
| `/usr/local/opencli/` | `/usr/local/davcli/` | installer, update paths |
| `/usr/local/admin/` | `/usr/local/davadmin/` | installer, admin binary |
| `openpanel.config` | `davpanel.config` | config loader and installer |
| `OPENPANEL` cookie | `DAVPANEL` cookie | `internal/core/session/session.go` |
| `docker.io/openpanel/*` | `ghcr.io/kangpcode/*` | installer, build scripts |
| `openpanel-screenshots`, `openadmin-screenshots` | `davpanel-screenshots`, `davadmin-screenshots` | website assets and all references |
| `openpanel-openapi.yaml`, `openadmin-openapi.yaml` | `davpanel-openapi.yaml`, `davadmin-openapi.yaml` | public API specs |
| `landing-hero-showcase-opencli-terminal.tsx` | `landing-hero-showcase-davcli-terminal.tsx` | website component |
| `openpanel-logo.tsx`, `small-openpanel-logo.tsx` | `davpanel-logo.tsx`, `small-davpanel-logo.tsx` | website React icons |

### Self-hosting overrides

Three hosted endpoints were hard-coded to the project domain. They now honour
environment variables while keeping the same defaults and the same license flow:

| Variable | Default | Purpose |
| -------- | ------- | ------- |
| `DAVPANEL_PHP_VERSIONS_API` | `https://api.davpanel.com/php-versions/` | PHP version status badges |
| `DAVPANEL_SCREENSHOTS_API` | `https://api.davpanel.com/screenshots` | website screenshot fallback |
| `DAVPANEL_LICENSE_API` | `https://api.davpanel.com/enterprise/index.php` | Enterprise license validation |

`DAVPANEL_LICENSE_API` only changes the endpoint; signature/tag parsing and feature
gating are untouched.

---

## 4. Inventory of changes

Measured against the pre-rebrand backup (`/tmp/opencode/DavPanel-pre-rebrand.tgz`):

| Metric | Count |
| ------ | ----- |
| Modified files | 1,192 |
| Renamed / removed paths | 1,737 tracked deletions |
| New files / directories | 455 (rename targets, `NOTICE.md`, `REBRANDING.md`, four top-level dirs, logo assets) |
| Brand tokens outside upstream citations, after | 1 (the upstream-attribution header in `base.html`) |
| Website image assets renamed | 159 |
| Broken image references introduced | 0 (3,622 `/img/...` references checked) |
| Renamed docs/blog files | 298 (slugs change with them) |

Scope = the whole tree except `LICENSE`, `NOTICE.md`, `README.md`, `REBRANDING.md` and
upstream citation URLs. Counts are against the initial `9cff912` snapshot.

### Application

- Go module and every internal import → `github.com/kangpcode/davpanel`.
- Session cookie → `DAVPANEL`; config → `/etc/davpanel/davpanel/conf/davpanel.config`.
- CLI helpers renamed for consistency (`runDavcli`, `buildDavPanelLoginPHP`).
- Dockerfile labels/author, `COPY davcli`, `CMD ["/davpanel"]`.
- Default template title fallback, logo markup, bug-report link and dual
  upstream/fork copyright header.
- Admin/user bug-report URLs point to `kangpcode/DavPanel`.

### Installer (`PODMAN_INSTALL.sh`)

- New DavPanel ASCII banner, new author header, `davpanel.com` install URL.
- Repositories: `kangpcode/davpanel-configuration`, `kangpcode/davadmin`,
  `kangpcode/davcli`; images `ghcr.io/kangpcode/davpanel`,
  `ghcr.io/kangpcode/davpanel-caddy-coraza`.
- Paths, ports, log directories, support footer and flag help rebranded.
- Dead Discord URL removed in favour of GitHub Discussions.

### Website

- `docusaurus.config.js`: title, URL, organization/project, edit URLs, footer,
  keywords, social image, contact and schema.
- Nav/footer, landing pages, comparison tables, calculator keys, CLI terminal
  showcase, install/support/community/roadmap/mobile/patches pages.
- Removed upstream analytics/tracking (GA/gtag, Microsoft Clarity) and dead
  upstream social accounts.
- New logo, favicon, social card and blog-cover logo; OpenAPI specs and `llms.txt`
  rebranded; `CNAME` and `robots.txt` now point at `davpanel.com`.
- All screenshot directories and 159 image filenames renamed, with every
  documentation/blog reference updated.
- Documentation body text, front matter, sidebar ids, versioned docs, changelogs and
  blog posts rebranded; docs/blog filenames renamed, so a handful of documentation and
  blog URLs change (`openpanel-and-whmcs` → `davpanel-and-whmcs`). Upstream issue/PR
  links are kept as historical citations.
- Old URLs keep working: `website/redirects.json` gained 377 entries covering renamed
  docs (current + versioned), blog posts, blog tag/author pages and the `OpenCLI`
  category pages (415 entries in total).

### Docs and metadata

- `README.md`: fork banner, component table, maintainer, upstream and license sections.
- `CONTRIBUTING.md`: fork tracker/discussions, no dead Discord/community links.
- `SECURITY.md`: fork advisory URL and supported-version table.
- `NOTICE.md`: attribution, mapping table, override table, third-party notes.
- `LICENSE`: upstream EULA retained verbatim; a fork notice was prepended.
- `.gitmodules`: all submodule URLs point at `kangpcode/*` placeholders.

---

## 5. Validation performed

| Check | Result |
| ----- | ------ |
| `go build ./...` | pass |
| `go test ./...` | pass (all packages) |
| `gofmt` on touched Go files | clean |
| `bash -n PODMAN_INSTALL.sh` | pass |
| `bash -n UPDATES/*/UPDATE.sh` | pass |
| `bash -n` repo-wide | 6 failures, all in archived doc snippets; 6/6 also fail pre-rebrand |
| `node --check website/docusaurus.config.js` | pass |
| `node --check website/sidebars.js` | pass |
| `/img/...` reference sweep (3,622 refs) | no new broken links |
| Relative `.md` link sweep | 4 links, 0 broken |
| Versioned sidebar doc ids | 37 ids, all resolve |
| JSON parse (`website/**`, `davpanel/**`) | 182 files, 0 invalid |
| Redirect map | 415 entries; 0 duplicates, 0 self-redirects, 0 chains, 0 shadowed routes |
| Brand sweep outside upstream citations | 1 hit, intentional (§6) |

The website build was **not** executed because `website/node_modules` is absent in this
environment. Config, sidebar and import paths were validated statically.

---

## 6. Intentionally preserved upstream references

These are not oversights:

1. **Legal text** — `LICENSE` keeps "OpenPanel, LLC", the EULA and trademark clauses.
2. **Attribution** — `NOTICE.md`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md` and the
   template header credit Stefan Pejcic / OpenPanel contributors.
3. **Historical citations** — links to `stefanpejcic/OpenPanel/{issues,pull,discussions,commit}`
   in code comments, changelogs and docs.
4. **Historical statements** — changelog and blog wording keeps upstream history readable;
   only brand names, asset paths and citations were changed. Issue/PR links still point
   at the upstream repository because that is where those discussions live.
5. **Third-party services** — upstream-only utilities such as `tinyphotogallery`,
   `openpanel-tests` benchmark scripts, Blesta/Hostkey/Cloudzy marketplace pages and
   `sentinelfirewall` assets are linked as-is because they are not owned by this fork.
6. **Mongo helper** — `openClient` in `mongomanager` is the MongoDB client constructor,
   unrelated to OpenPanel.

---

## 7. Gaps caused by the source snapshot

These directories are **empty submodules** in this checkout, so their code could not be
rebranded locally:

`davadmin/`, `davcli/`, `configuration/`, `tests/`, `translations/`,
`mailserver/`, `vsftpd/`, `mobile/`, and `integrations/*`.

Their `.gitmodules` URLs already point at the intended `kangpcode/*` repositories, but
those repositories must be created and pushed before `git submodule update` will work.
Two branding issues therefore remain outside this tree:

- The DavAdmin UI templates (compiled into the `davadmin` binary) still need the same
  string/path pass when that repository is populated.
- The mobile app, translations and billing modules need their own rebrand commits.

---

## 8. Required infrastructure (placeholders in this tree)

| Placeholder | Needed action |
| ----------- | ------------- |
| `github.com/kangpcode/DavPanel` | create repository, push this tree |
| `github.com/kangpcode/{davadmin,davcli,davpanel-configuration,davpanel-tests,davpanel-translations,...}` | create and push the forked submodules |
| `ghcr.io/kangpcode/davpanel` | build/publish the panel image |
| `ghcr.io/kangpcode/davpanel-caddy-coraza` | build/publish via `caddy/build.sh --push` |
| `davpanel.com`, `my.davpanel.com`, `api.davpanel.com`, `community.davpanel.com` | DNS + TLS + services |
| `api.davpanel.com/php-versions/`, `/screenshots`, `/v2/statistics/`, `/enterprise/` | reimplement or override via the new env vars |
| OpenAPI/OG images under `/img/og/` | several OG images were already missing upstream; regenerate if needed |
| Upstream UI screenshots | pixels still show the old panel; re-capture after the fork UI ships |

Because `api.davpanel.com` does not exist yet:

- PHP version badges fall back to empty data (safe degradation).
- Remote screenshots fall back to the local cache/failure path.
- Enterprise licenses report "not valid" until a license server exists at the default
  URL or `DAVPANEL_LICENSE_API` is set. This is intentional: gating is not bypassed.

---

## 9. Legal position

- The upstream license is proprietary/EULA for the UI and admin panel, with CC BY-NC
  terms for the CLI and configuration files. Redistribution and commercial hosting
  remain subject to those terms.
- The fork retains all copyright and trademark notices and clearly identifies itself as
  a fork in `README.md`, `NOTICE.md` and the application template header.
- "OpenPanel" and the OpenPanel logo remain trademarks of OpenPanel, LLC. The DavPanel
  name and shield mark are used only to identify this fork.
- Anyone deploying DavPanel commercially should obtain the upstream Enterprise license
  or written permission; renaming does not transfer rights.

---

## 10. Suggested next steps

1. Create the GitHub organization/repositories and push this tree plus the submodules.
2. Run the `davadmin` string/path pass and publish its binary.
3. Build and push both container images, then test `PODMAN_INSTALL.sh` on a clean VPS.
4. Stand up `davpanel.com` and the API endpoints, or set the three `DAVPANEL_*` overrides.
5. Re-capture panel screenshots (the pixels still show the old UI) and regenerate
   `llms-full.txt` from the fork's docs if the doc source changes again.
6. Run `npm install && npm run build` in `website/` and fix any remaining page-level drift.

---

## 11. Rollback

The untouched pre-rebrand tree is at `/tmp/opencode/DavPanel-pre-rebrand.tgz`
(280 MB). The replacement map used for the automated pass is kept at
`/tmp/opencode/rebrand_app.py`; the image-rename map is at
`/tmp/opencode/imgmap.json`.
