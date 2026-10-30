---
sidebar_label: "DavPanel Folder Structure"
---

# Control Panel Files and Folder Structure Explained

DavPanel uses the following files and directories:

Configuration:
```
/etc/davpanel/
├── bind9/                    - Configuration for DNS service.
├── caddy/                    - Caddy webserver configuration and data.
├── clamav/                   - ClamAV service configuration.
├── docker/                   - Docker configuration.
├── ftp/                      - Settings and user data for FTP service.
├── goaccess/                 - Configuration for GoAccess reports.
├── mysql/                    - Database schema.
├── nginx/                    - Nginx webserver configuraton [DEPRECATED].
├── davadmin/                - Settings for the admin panel.
├── davpanel/                - Settings for the user panel.
├── php/                      - PHP blueprints.
├── services/                 - Services configuration files.
├── skeleton/                 - Files used for new user accounts.
├── ssh/                      - SSH configuration and motd.
└── varnish/                  - Varnish configuration - [DEPRECATED].
```

Default configuration can be viewed [here](https://github.com/stefanpejcic/OpenPanel-configuration).


## User Files

All files for a user are stored in their /home directory: `/home/$docker_context/`:

```
/home/stefan/
├── docker-compose.yml        - Contains all services that user can run.
├── .env                      - Contains ports, resource limits and passwrods for services.
├── httpd.conf                - main configuration that is used IF user runs Apache webserver.
├── nginx.conf                - main configuration that is used IF user runs Nginx webserver.
├── openresty.conf            - main configuration that is used IF user runs OpenResty webserver.
├── openlitespeed.conf        - main configuration that is used IF user runs OpenLitespeed webserver.
├── default.vcl               - Varnish Configuration that is used if Varnish cache is enabled for user.
├── php.ini/                  - PHP.INI files hat user can edit via 'DavPanel > PHP > PHP.INI Editor' page.
├── crons.ini                 - Cron jobs that user can edit via 'DavPanel > Cron Jobs' page.
├── backup.env                - Backup configuration that user can edit via 'DavPanel > Files > Backups' page.
├── my.cnf                    - MySQL root user logins that are used for ALL actions from the DavPanel UI.
├── custom.cnf                - MySQL Configuration that user can edit via 'DavPanel > MySQL > Configuration' page.
├── postgre_custom.conf       - PostgreSQL Configuration that user can edit via 'DavPanel > PostgreSQL > Configuration' page.
├── pma.php                   - used to allow auto-login to phpMyAdmin from DavPanel UI.
├── docker-data/              - All docker files: containers, images, volumes..
│   └── volumes/ 
│       ├── $context_html_data/             - Website files (/var/www/html/ in 'DavPanel > File Manager' page).
│       ├── $context_mysql_data/            - MySQL storage (all databases).
│       ├── $context_mysql_dumps/           - MySQL /tmp folder used for dumps.
│       ├── $context_pg_data/               - PostgreSQL storage (all databases).
│       └── $context_webserver_data/        - VirtualHosts files for domains.
├── .config/                  - systemd service files.
├── .docker/                  - Docker service files.
├── bin/                      - service files.
├── sockets/                  - sockets for running services.
└── .bashrc                   - Sets path and docker host.
```

## User Services files

Certain files are shared across user services to provide Administrators with a single point of management. This enables faster updates and easier customization for all users. For example, it allows updating WP-CLI simultaneously for everyone or configuring OpenLiteSpeed consistently across all accounts.

- `/etc/davpanel/wordpress/wp-cli.phar`           - WP-CLI binnary used in OpenLitespeed and all PHP containers.
- `/etc/davpanel/openlitespeed/start.sh`          - Sets permissions and maps all individual VHosts files on OpenLitespeed.
- `/etc/davpanel/nginx/certs/`                    - Self-signed SSL files for domains used inside user webservers.
- `/etc/davpanel/nginx/default_page.html`         - Landing page displayed on user domains if no files exist.
- `/etc/davpanel/mysql/scripts/dump.sh`           - Script used to generate mysql dumps when performing backups.
- `/etc/davpanel/mysql/phpmyadmin/config.inc.php` - phpMyAdmin configuration file that allows auto-login from UI.
- `/etc/davpanel/php/ioncube/`                    - Ioncube Loader files for PHP.
- `/etc/davpanel/php/ioncube_extension.ini`       - Ioncube Loader extension for PHP.

## Shared Services files

Files that are used by shared services like FTP, Caddy webserver and Mailserver.

- `/etc/davpanel/wordpress/wp-cli.phar`           - WP-CLI binnary used in OpenLitespeed and all PHP containers.
- `/etc/davpanel/wordpress/wp-cli.phar`           - WP-CLI binnary used in OpenLitespeed and all PHP containers.

## Templates files

Files that are used for new services/domains that users add.

- `/etc/davpanel/docker/compose/nodejs.yml`       - Used for new docker services via 'DavPanel > Websites > Install App > NodeJS' page.
- `/etc/davpanel/docker/compose/python.yml`       - Used for new docker services via 'DavPanel > Websites > Install App > Python' page.
- `/etc/davpanel/docker/compose/ruby.yml`       - Used for new docker services via 'DavPanel > Websites > Install App > Ruby' page.
- `/etc/davpanel/docker/compose/java.yml`       - Used for new docker services via 'DavPanel > Websites > Install App > Java' page.
- `/etc/davpanel/docker/daemon/rootless.json`     - Used for new users to configure docker rootless service.
- `/etc/davpanel/apache/httpd.conf`     - Main configuration file used for new users with Apache webserver.
- `/etc/davpanel/backups/backup.env`     - Template used for new user backups.
- `/etc/davpanel/backups/customized.template`     - Notifications template used for user backups.
- `/etc/davpanel/bind9/zone_template.txt` - DNS zone template used for new domains with IPv4 set for the user.
- `/etc/davpanel/bind9/zone_template_ipv6.txt` - DNS zone template used for new domains with IPv6 set for the user.
- `/etc/davpanel/bind9/zone_template_ipv6.txt` - DNS zone template used for new domains with IPv6 set for the user.
- `/etc/davpanel/caddy/templates/domain.conf` - Caddyfile used for new domains.
- `/etc/davpanel/caddy/templates/suspended_domain.html` - Landing page displayed on suspended domains for a user.
- `/etc/davpanel/caddy/templates/suspended_user.html` - Landing page displayed on domains for a suspended user.
- `/etc/davpanel/csf/csf.blocklists` - CSF blocklists used when configuring Sentinel Firewall.
- `/etc/davpanel/mysql/user.cnf` - Configuration file used for MySQL services.


## Configuration files

- `/etc/davpanel/caddy/templates/wp.rules` - Rules used for hardening options in WP Manager.
- `/etc/davpanel/clamav/extensions.txt` - List of extensions to scan using ClamAV (DEPRECATED).
- `/etc/davpanel/csf/csf.blocklists` - CSF blocklists used when configuring Sentinel Firewall.
- `/etc/davpanel/ftp/start_vsftpd.sh` - Entrypoint for FTP service (creates accounts on startup).
- `/etc/davpanel/ftp/vsftpd.conf` - Vsftpd main configuration file.
- `/etc/davpanel/goaccess/goaccess.conf` - GoAccess main configuration file.
- `/etc/davpanel/mysql/initialize/1.1/plans.sql` - Initializes database on DavPanel installation.
- `/etc/davpanel/mysql/host_mysql.cnf` - Stores mysql logins for the DavPanel installation.
- `/etc/davpanel/mysql/keys.txt` - List of configuration keys editable from 'DavPanel > MySQL > Configuration' page.
- `/etc/davpanel/mysql/mysqld.cnf` - Configuration file for MySQL service.
- `/etc/davpanel/docker/templates/docker_apache_domain.conf` - VirtualHosts template for new domains on Apache webserver.
- `/etc/davpanel/docker/templates/docker_litespeed_domain.conf` - VirtualHosts template for new domains on OpenLitespeed webserver.
- `/etc/davpanel/docker/templates/docker_nginx_domain.conf` - VirtualHosts template for new domains on Nginx webserver.
- NOTE: list is incomplete, please refer to https://github.com/stefanpejcic/openpanel-configuration/tree/main for a full list.
