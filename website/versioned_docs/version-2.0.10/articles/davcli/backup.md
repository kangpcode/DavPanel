# Backup

`davcli backup` backs up (and restores) DavPanel/DavAdmin **system configuration** — panel settings, per-domain webserver/DNS config, the root `docker-compose.yml`/`.env` stacks, PHP/MySQL/FTP/SSH config, etc.

It deliberately excludes real user data: website files, databases, mailbox contents, mail accounts/DKIM keys, and large downloadable software assets (CMS installer archives, the GeoIP database, the vendored Caddy WAF ruleset, ionCube/composer caches) are never touched.

Destination and retention are read from `/etc/davpanel/davadmin/config/backups.ini` — this is the same command DavAdmin's [System Backups](/docs/admin/backups/system/) page uses under the hood.

Create a backup:
```bash
davcli backup
```

Restore from an archive:
```bash
davcli backup --restore <archive_filename>
```

Additional flags:

- `--quiet` - only log to file, don't print progress to stdout.
