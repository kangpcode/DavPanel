# Update 

For this fork, published container tags are read from GHCR using registry token
authentication. Remote updates require published `ghcr.io/kangpcode/davpanel`
images and standalone fork release artifacts. Until publication, follow the
local source build procedure in the repository's `INSTALL.md`; the clean-server
installer is not an upgrade command for existing accounts.


`davcli update` command is used to check if new update is available and to update.

Check if update is available:
```bash
davcli update --check
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --check
{"status": "Update available", "installed_version": "2.0.11", "latest_version": "2.0.12"}
```
</details>

Start update immediately if `autoupdate` or `autopatch` is enabled:
```bash
davcli update
```

<details>
  <summary>Example output</summary>

```bash
# davcli update
[INFO] Update available and will be automatically installed
===== Starting update to version 2.0.12 =====
[INFO] Update log: /var/log/davpanel/updates/2.0.12.log
---- Updating DavCLI ----
[INFO] Downloading terminal scripts from github: https://github.com/kangpcode/davcli/archive/refs/heads/podman.tar.gz
[INFO] [✔] Terminal commands updated successfully
---- Updating DavPanel container image ----
...
---- [✔] image ghcr.io/kangpcode/davpanel:2.0.12 downloaded successfully ----
---- Updating version in /root/.env ----
---- Restarting DavPanel service ----
...
---- Cleaning up previous images ----
---- Updating installed locales ----
[INFO] Updated locale: de-de
[INFO] Updated locale: sr-rs
---- [✔] Locales updated: 2, failed: 0 ----
---- Updating DavAdmin modules ----
---- Updating DavAdmin ----
---- [✔] DavAdmin update triggered (applying in background) ----
---- Regenerating logrotate configs ----
---- [✔] Minor update - skipping system updates ----
---- Checking for custom post-update scripts ----
---- Update completed successfully! ----
```
</details>

Add `--no-restart` to install the update without restarting the `davpanel` container and the `admin` service. The new versions are applied on their next restart, and `/root/davpanel_restart_needed` and `/root/davadmin_restart_needed` are created so DavAdmin shows that a restart is needed:
```bash
davcli update --force --no-restart
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --force --no-restart
...
---- [✔] image ghcr.io/kangpcode/davpanel:2.0.18 downloaded successfully ----
---- Updating version in /root/.env ----
---- [!] Skipping DavPanel restart, restart the 'davpanel' container to apply the new version ----
...
---- [!] DavAdmin updated, restart the 'admin' service to apply it ----
...
```
</details>

If both `autoupdate` and `autopatch` are disabled, nothing is installed:

<details>
  <summary>Example output</summary>

```bash
# davcli update
[INFO] [!] Autopatch and Autoupdate are both disabled. No updates will be installed automatically.
```
</details>

Only one update can run at a time. An update that doesn't finish within 30 minutes is stopped, and an update lock older than 30 minutes is treated as stale and deleted, so a stuck update can't block new ones.

<details>
  <summary>Example output</summary>

```bash
# davcli update
[INFO] Update available and will be automatically installed
[✘] Error: Update process is already running.
Lock /var/lock/davpanel_update.lock is held by PID: 12345
Please wait for it to complete before retrying.
```
</details>

Start update immediately, regardless of `autoupdate` or `autopatch` setting:
```bash
davcli update --force
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --force
[INFO] [!] Forcing update, ignoring autopatch and autoupdate settings
[INFO] Update available and will be automatically installed
===== Starting update to version 2.0.12 =====
[INFO] Update log: /var/log/davpanel/updates/2.0.12.log
---- Updating DavCLI ----
[INFO] Downloading terminal scripts from github: https://github.com/kangpcode/davcli/archive/refs/heads/podman.tar.gz
[INFO] [✔] Terminal commands updated successfully
---- Updating DavPanel container image ----
...
---- [✔] image ghcr.io/kangpcode/davpanel:2.0.12 downloaded successfully ----
---- Updating version in /root/.env ----
---- Restarting DavPanel service ----
...
---- Cleaning up previous images ----
---- Updating installed locales ----
[INFO] Updated locale: de-de
[INFO] Updated locale: sr-rs
---- [✔] Locales updated: 2, failed: 0 ----
---- Updating DavAdmin modules ----
---- Updating DavAdmin ----
---- [✔] DavAdmin update triggered (applying in background) ----
---- Regenerating logrotate configs ----
---- [✔] Minor update - skipping system updates ----
---- Checking for custom post-update scripts ----
---- Update completed successfully! ----
```
</details>

## Admin

Update only DavAdmin UI *(`/usr/local/admin/` from [kangpcode/davadmin](https://github.com/stefanpejcic/openadmin))*:
```bash
davcli update --admin
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --admin
Updating DavAdmin
[✔] DavAdmin update triggered (applying in background)
```
</details>

## Panel

Update only DavPanel UI *(container image from [davpanel/davpanel-ui](https://hub.docker.com/r/davpanel/davpanel))*:
```bash
davcli update --panel
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --panel
...
davpanel
```
</details>

## Terminal

Update only DavCLI *(`/usr/local/davcli/` from [kangpcode/davcli](https://github.com/stefanpejcic/opencli))*:
```bash
davcli update --cli
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --cli
Updating DavCLI
[INFO] Downloading terminal scripts from github: https://github.com/kangpcode/davcli/archive/refs/heads/podman.tar.gz
[INFO] [✔] Terminal commands updated successfully
```
</details>

## Locales

Update only translation files *(locale files from [kangpcode/davpanel-translations](https://github.com/stefanpejcic/openpanel-translations))*:
```bash
davcli update --translations
```

Each locale download is tried up to 3 times with a 60 second limit per try, a locale that can't be downloaded is counted as failed and keeps its current file, and the update continues.

<details>
  <summary>Example output</summary>

```bash
# davcli update --translations
Updating installed locales
[INFO] Updated locale: de-de
[INFO] Updated locale: sr-rs
[✔] Locales updated: 2, failed: 0
[INFO] Restarting DavPanel service
[INFO] [✔] Translations updated and DavPanel restarted
```
</details>

## System

Update system packages and kernel, remove older kernels and check if a reboot is required:
```bash
davcli update --system
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --system
[INFO] Updating system packages
System package update ready to proceed. A full server backup is recommended beforehand. Continue? [y/N] y
[INFO] Installing required system tools
[INFO] Updating system packages
[INFO] Cleaning up packages
[INFO] Removing old kernels (Debian/Ubuntu)
[INFO] Checking if reboot is required
[WARN] [!]  Reboot required!
```
</details>

You'll be asked to confirm before packages are updated. A full server backup is recommended beforehand.

## Modules

Update only the DavAdmin modules/features list *(`/etc/davpanel/davadmin/config/features.json` from [kangpcode/davpanel-configuration](https://github.com/stefanpejcic/openpanel-configuration))*:
```bash
davcli update --modules
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --modules
Updating DavAdmin modules
```
</details>

If the file can't be downloaded or isn't valid JSON, the current `features.json` is kept.

## Templates

Update only the `docker-compose.yml` template used for new users *(`/etc/davpanel/docker/compose/1.0/docker-compose.yml`)*:
```bash
davcli update --compose
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --compose
[INFO] Updating /etc/davpanel/docker/compose/1.0/docker-compose.yml
[INFO] Previous file saved as /etc/davpanel/docker/compose/1.0/docker-compose.yml.bak
[INFO] [✔] docker-compose.yml updated
```
</details>

Update only the `.env` template used for new users *(`/etc/davpanel/docker/compose/1.0/.env`)*:
```bash
davcli update --env
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --env
[INFO] Updating /etc/davpanel/docker/compose/1.0/.env
[INFO] Previous file saved as /etc/davpanel/docker/compose/1.0/.env.bak
[INFO] [✔] .env updated
```
</details>

The previous file is saved with a `.bak` extension. Existing users are not changed.

## PHP

Update PHP files and add new PHP versions to the template and to all existing users:
```bash
davcli update --php
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --php
===== Updating PHP =====
[INFO] Downloading configuration files from github
[INFO] PHP versions on github: 5.6 7.0 7.1 7.2 7.3 7.4 8.0 8.1 8.2 8.3 8.4 8.5
[INFO] Overwriting /etc/davpanel/php/
[INFO] [✔] /etc/davpanel/php/ updated
[INFO] Checking template in /etc/davpanel/docker/compose/1.0
[INFO] [template] up to date
[INFO] Checking user stefan (1)
[INFO] [stefan] mounts added: php-fpm-8.5:/etc/davpanel/php/ioncube/ioncube_loader_lin_8.5.so php-fpm-8.5:/etc/davpanel/php/ioncube_extension.ini
[INFO] [stefan] backups: /home/stefan/docker-compose.yml.php_20260924_103000.bak, /home/stefan/.env.php_20260924_103000.bak
[INFO] Checking user demo (2)
[INFO] [demo] added: php-fpm-8.5 PHP_FPM_8_5_CPU PHP_FPM_8_5_RAM PHP_FPM_8_5_PIDS php.ini/8.5.ini
[INFO] [demo] backups: /home/demo/docker-compose.yml.php_20260924_103000.bak, /home/demo/.env.php_20260924_103000.bak
===== PHP update summary =====
  template: unchanged
  stefan: changed: | mounts: php-fpm-8.5:/etc/davpanel/php/ioncube/ioncube_loader_lin_8.5.so php-fpm-8.5:/etc/davpanel/php/ioncube_extension.ini
  demo: changed: php-fpm-8.5 PHP_FPM_8_5_CPU PHP_FPM_8_5_RAM PHP_FPM_8_5_PIDS php.ini/8.5.ini
  Users checked: 2 | updated: 2 | up to date: 0 | skipped: 0 | failed: 0
```
</details>

This will:
- replace `/etc/davpanel/php/` (ini files, ionCube loaders, composer) with the latest files from [kangpcode/davpanel-configuration](https://github.com/stefanpejcic/openpanel-configuration),
- add any missing `php-fpm-X.Y` services to `docker-compose.yml` and their `PHP_FPM_X_Y_*` limits to `.env`,
- add missing PHP mounts (php.ini, ionCube) to the OpenLiteSpeed service,
- add missing ionCube mounts to existing `php-fpm-X.Y` services (e.g. when a loader for a PHP version becomes available),
- copy the `php.ini/X.Y.ini` file for each new version.

The template and every user in `/home/` are checked. Before changing a file, a backup is saved as `docker-compose.yml.php_<date>.bak` and `.env.php_<date>.bak`. If the new configuration is invalid, the backup is restored and that user is skipped. A summary is shown at the end.

Running containers are not restarted. New mounts take effect the next time the user's PHP or OpenLiteSpeed service is restarted.

## Service files

These options download the latest files for a single service from [kangpcode/davpanel-configuration](https://github.com/stefanpejcic/openpanel-configuration) and overwrite the files in `/etc/davpanel/`. Files that exist only on your server are kept. Several options can be combined, the files are downloaded only once.

### WP-CLI

Update WP-CLI *(`/etc/davpanel/wordpress/wp-cli.phar`)*:
```bash
davcli update --wp
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --wp
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/wordpress/wp-cli.phar updated
```
</details>

### OpenLiteSpeed

Update OpenLiteSpeed files *(`/etc/davpanel/openlitespeed/` from [kangpcode/davpanel-configuration](https://github.com/stefanpejcic/openpanel-configuration/tree/main/openlitespeed))*:
```bash
davcli update --ols
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --ols
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/openlitespeed updated
```
</details>

### Apache

Update Apache files *(`/etc/davpanel/apache/` from [kangpcode/davpanel-configuration](https://github.com/stefanpejcic/openpanel-configuration/tree/main/apache))*:
```bash
davcli update --apache
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --apache
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/apache updated
```
</details>

### ClamAV

Update ClamAV files *(`/etc/davpanel/clamav/`)*. If the `clamav` container is running, it is also removed, its image is deleted, and the container is started again with a newly downloaded image:
```bash
davcli update --clamav
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --clamav
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/clamav updated
[INFO] Removing clamav container
[INFO] Deleting image docker.io/clamav/clamav:1.4
[INFO] Downloading new clamav image
[INFO] Starting clamav container
[INFO] [✔] clamav container restarted with the new image
```
</details>

If the container is not running, only the files are updated:

<details>
  <summary>Example output</summary>

```bash
# davcli update --clamav
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/clamav updated
[INFO] clamav container is not running, skipping image update
```
</details>

### phpMyAdmin

Update phpMyAdmin files *(`/etc/davpanel/mysql/phpmyadmin/`)*. If the `phpmyadmin` container is running, it is also removed, its image is deleted, and the container is started again with a newly downloaded image:
```bash
davcli update --phpmyadmin
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --phpmyadmin
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/mysql/phpmyadmin updated
[INFO] Removing phpmyadmin container
[INFO] Deleting image docker.io/library/phpmyadmin:latest
[INFO] Downloading new phpmyadmin image
[INFO] Starting phpmyadmin container
[INFO] [✔] phpmyadmin container restarted with the new image
```
</details>

### PostgreSQL

Update PostgreSQL files *(`/etc/davpanel/postgres/` from [kangpcode/davpanel-configuration](https://github.com/stefanpejcic/openpanel-configuration/tree/main/postgres))*:
```bash
davcli update --postgres
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --postgres
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/postgres updated
```
</details>

### Skeleton

Update the files copied to new user accounts *(`/etc/davpanel/skeleton/` from [kangpcode/davpanel-configuration](https://github.com/stefanpejcic/openpanel-configuration/tree/main/skeleton))*:
```bash
davcli update --skeleton
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --skeleton
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/skeleton updated
```
</details>

### SSH

Update SSH files *(`/etc/davpanel/ssh/` from [kangpcode/davpanel-configuration](https://github.com/stefanpejcic/openpanel-configuration/tree/main/ssh))*:
```bash
davcli update --ssh
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --ssh
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/ssh updated
```
</details>

### Varnish

Update Varnish files *(`/etc/davpanel/varnish/` from [kangpcode/davpanel-configuration](https://github.com/stefanpejcic/openpanel-configuration/tree/main/varnish))*:
```bash
davcli update --varnish
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --varnish
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/varnish updated
```
</details>

### Cron

Update the DavPanel cron jobs *(`/etc/davpanel/cron`)* and install them to `/etc/cron.d/davpanel`:
```bash
davcli update --cron
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --cron
[INFO] Downloading configuration files from github
[INFO] [✔] /etc/davpanel/cron updated
[INFO] [✔] /etc/cron.d/davpanel updated
```
</details>

## Combining options

Several options can be combined. They run in the order given:
```bash
davcli update --compose --env
```

<details>
  <summary>Example output</summary>

```bash
# davcli update --compose --env
[INFO] Updating /etc/davpanel/docker/compose/1.0/docker-compose.yml
[INFO] Previous file saved as /etc/davpanel/docker/compose/1.0/docker-compose.yml.bak
[INFO] [✔] docker-compose.yml updated
[INFO] Updating /etc/davpanel/docker/compose/1.0/.env
[INFO] Previous file saved as /etc/davpanel/docker/compose/1.0/.env.bak
[INFO] [✔] .env updated
```
</details>

