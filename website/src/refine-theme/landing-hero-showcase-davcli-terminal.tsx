import React from "react";
import clsx from "clsx";

type Props = {
    className?: string;
};

const DAVCLI_COMMANDS: { cmd: string; desc: string; usage: string }[] = [
    { cmd: `davcli php-default`, desc: `View or change the default PHP version used for new domains added by user.`, usage: `davcli php-default <username>` },
    { cmd: `davcli php-domain`, desc: `View or change the PHP version used for a single domain name.`, usage: `davcli php-domain <domain_name>` },
    { cmd: `davcli files-fix_permissions`, desc: `Fix permissions for users /home directory files inside the container.`, usage: `davcli files-fix_permissions <USERNAME> [PATH]` },
    { cmd: `davcli files-purge_trash`, desc: `Auto-purge .Trash folders for users.`, usage: `davcli files-purge_trash --user [USERNAME]` },
    { cmd: `davcli files-calculate_resellers_storage`, desc: `Calculates total disk usage for all resellers.`, usage: `davcli files-calculate_resellers_storage` },
    { cmd: `davcli proxy`, desc: `View and change proxy path '/davpanel' for accessing DavPanel.`, usage: `davcli port [set <path>]` },
    { cmd: `davcli update`, desc: `Check if update is available, install updates.`, usage: `davcli update [--check | --force | --admin | --panel | --cli]` },
    { cmd: `davcli domains-all`, desc: `Lists all domain names currently hosted on the server.`, usage: `davcli domains-all [--docroot|--php_version]` },
    { cmd: `davcli domains-delete`, desc: `Delete a domain name.`, usage: `davcli domains-delete <DOMAIN_NAME> --debug` },
    { cmd: `davcli domains-docroot`, desc: `View and change docroot for a domain.`, usage: `davcli domains-docroot <DOMAIN_NAME> [update </var/www/html/>] --debug` },
    { cmd: `davcli domains-unsuspend`, desc: `Unsuspend a domain name`, usage: `davcli domains-unsuspend <DOMAIN-NAME>` },
    { cmd: `davcli domains-add`, desc: `Add a domain name for user.`, usage: `davcli domains-add <DOMAIN_NAME> <USERNAME> [--docroot DOCUMENT_ROOT] [--php_version N.N] [--skip_caddy --skip_vhost --skip_containers --skip_dns] --debug` },
    { cmd: `davcli domains-dns`, desc: `Manage DNS for a domain.`, usage: `davcli domains-dns <DOMAIN>` },
    { cmd: `davcli domains-edit`, desc: `Enter docroot for a domain.`, usage: `davcli domains-edit <DOMAIN_NAME>` },
    { cmd: `davcli domains-ssl`, desc: `Check SSL for domain, add custom certificate, view files.`, usage: `davcli domains-ssl <DOMAIN_NAME> [status|info|logs|auto|custom] [path/to/fullchain.pem path/to/key.pem]` },
    { cmd: `davcli domains-suspend`, desc: `Suspend a domain name`, usage: `davcli domains-suspend <DOMAIN-NAME> [--comment="<COMMENT>"]` },
    { cmd: `davcli domains-dnssec`, desc: `Enable DNSSEC for a domain and re-sign after changes in the zone.`, usage: `davcli domains-dnssec <DOMAIN> [--update | --check]` },
    { cmd: `davcli domains-hsts`, desc: `Manage HSTS for a domain`, usage: `davcli hsts <domain> [on|off]` },
    { cmd: `davcli domains-user`, desc: `Lists all domain names currently owned by a specific user.`, usage: `davcli domains-user <USERNAME> [--docroot|--php_version]` },
    { cmd: `davcli domains-stats`, desc: `Parse caddy access logs for users domains and generate static html`, usage: `davcli domains-stats` },
    { cmd: `davcli domains-update_ns`, desc: `Change nameservers for a single or all dns zones.`, usage: `davcli domains-update_ns <DOMAIN_NAME>` },
    { cmd: `davcli domains-varnish`, desc: `Check Varnish status for domain, enable/disable Varnish caching.`, usage: `davcli domains-varnish <DOMAIN-NAME> [on|off] [--short]` },
    { cmd: `davcli domains-whoowns`, desc: `Check which username owns a certain domain name.`, usage: `davcli domains-whoowns <DOMAIN-NAME> [--context] [--docroot]` },
    { cmd: `davcli imunify`, desc: `Install and manage ImunifyAV service.`, usage: `davcli imunify [status|start|stop|install|update|uninstall]` },
    { cmd: `davcli report`, desc: `Generate a system report and send it to DavPanel support team.`, usage: `davcli report` },
    { cmd: `davcli admin`, desc: `Manage DavAdmin service and Administrators.`, usage: `davcli admin <command> [options]` },
    { cmd: `davcli waf`, desc: `Manage CorazaWAF`, usage: `davcli waf <setting>` },
    { cmd: `davcli user-change_plan`, desc: `Change plan for a user and apply new plan limits.`, usage: `davcli user-change_plan <USERNAME> <NEW_PLAN_NAME>` },
    { cmd: `davcli user-delete`, desc: `Delete user account and permanently remove all their data.`, usage: `davcli user-delete <username> [-y]` },
    { cmd: `davcli user-unsuspend`, desc: `Unsuspend user: start all containers and unsuspend domains`, usage: `davcli user-unsuspend <USERNAME>` },
    { cmd: `davcli user-email`, desc: `Change email for user`, usage: `davcli user-email <USERNAME> <NEW_EMAIL>` },
    { cmd: `davcli user-add`, desc: `Create a new user with the provided plan_name.`, usage: `davcli user-add <USERNAME> <PASSWORD|generate> <EMAIL> "<PLAN_NAME>" [--send-email] [--debug]  [--webserver="<nginx|apache|openresty|openlitespeed|litespeed|varnish+nginx|varnish+apache|varnish+openresty|varnish+openlitespeed>"] [--sql=<mysql|mariadb>] [--RESELLER=<RESELLER_USERNAME>][--server=<IP_ADDRESS>]  [--key=<SSH_KEY_PATH>] [--private-note="this user.."] [--no-sentinel]` },
    { cmd: `davcli user-quota`, desc: `Report or set disk and inodes for users.`, usage: `davcli user-quota <username|--all>` },
    { cmd: `davcli user-2fa`, desc: `Check or disable 2FA for a user.`, usage: `davcli user-2fa <username> [disable]` },
    { cmd: `davcli user-suspend`, desc: `Suspend user: stop all containers and suspend domains.`, usage: `davcli user-suspend <USERNAME>` },
    { cmd: `davcli user-backup`, desc: `Creates a full account .tar.gz backup of a single DavPanel user account.`, usage: `davcli user-backup --account <USER> [--output <DIR>] [--quiet]` },
    { cmd: `davcli user-transfer`, desc: `Transfers a single user account from this server to another.`, usage: `davcli user-transfer --account <DAVPANEL_USER> --host <DESTINATION_IP> --username <DESTINATION_SSH_USERNAME> --password <DESTINATION_SSH_PASSWORD> [--live-transfer]` },
    { cmd: `davcli user-list`, desc: `Display all users: id, username, email, plan, registered date.`, usage: `davcli user-list [--json]` },
    { cmd: `davcli user-ip`, desc: `Assing or remove dedicated IP to a user.`, usage: `davcli user-ip <USERNAME> <IP | DELETE> [-y] [--debug]` },
    { cmd: `davcli user-restore`, desc: `Restores a single DavPanel user account from a full account .tar.gz backup.`, usage: `davcli user-restore --file <ARCHIVE> [--force] [--new-username=NAME] [--quiet] [--temp-dir=<PATH> ]` },
    { cmd: `davcli user-rename`, desc: `Rename username.`, usage: `davcli user-rename <old_username> <new_username>` },
    { cmd: `davcli user-password`, desc: `Reset password for a user.`, usage: `davcli user-password <USERNAME> <NEW_PASSWORD | random>` },
    { cmd: `davcli user-block_ip`, desc: `Block IP addresses from accessng user domains.`, usage: `davcli user-block_ip <username> [--list='ip_here another_ip' | --delete-all]` },
    { cmd: `davcli user-varnish`, desc: `Enable/disable Varnish Caching for user and display current status.`, usage: `davcli user-varnish <USERNAME> [on|off]` },
    { cmd: `davcli user-loginlog`, desc: `View user's .lastlogin file with last 20 successfull logins.`, usage: `davcli user-loginlog <USERNAME> [--table|--text|--json]` },
    { cmd: `davcli user-login`, desc: `Generate an auto-login link for DavPanel user.`, usage: `davcli user-login <username> [--open|--delete]` },
    { cmd: `davcli user-check`, desc: `Performs comprehensive security checks on user files, Docker daemon and containers.`, usage: `davcli user-check <USERNAME>` },
    { cmd: `davcli license`, desc: `Manage DavPanel Enterprise license.`, usage: `davcli license verify` },
    { cmd: `davcli docker`, desc: `Manage DavPanel system or user containers with lazydocker.`, usage: `davcli docker [<user> [<container>]]` },
    { cmd: `davcli faq`, desc: `Display answers to most frequently asked questions.`, usage: `davcli faq` },
    { cmd: `davcli websites-vulnerability`, desc: `Scan WP site for vulnerabilities.`, usage: `davcli websites-vulnerability <DOMAIN> [--all]` },
    { cmd: `davcli websites-all`, desc: `Lists all websites currently hosted on the server.`, usage: `davcli websites-all` },
    { cmd: `davcli websites-secure`, desc: `WP Manager security rules for domain.`, usage: `davcli websites-secure <DOMAIN> [--rules='RULE1 RULE2' | --disable-all | --list-active-rules]` },
    { cmd: `davcli websites-pagespeed`, desc: `Check Google PageSpeed data for website(s)`, usage: `davcli websites-pagespeed <DOMAIN> [-all]` },
    { cmd: `davcli websites-scan`, desc: `Scan user files for WP sites and add them to SiteManager interface.`, usage: `davcli websites-scan $username` },
    { cmd: `davcli websites-user`, desc: `Lists all websites and domains owned by a specific user.`, usage: `davcli websites-user <USERNAME> [--type=] [--domains=] [--json]` },
    { cmd: `davcli port`, desc: `View and change port for accessing DavPanel.`, usage: `davcli port [set <port>]` },
    { cmd: `davcli ftp-delete`, desc: `Delete FTP sub-user for davpanel user.`, usage: `davcli ftp-delete <username> <davpanel_username> [--debug]` },
    { cmd: `davcli ftp-add`, desc: `Create FTP sub-user for davpanel user.`, usage: `davcli ftp-add <NEW_USERNAME> <NEW_PASSWORD> <FOLDER> <DAVPANEL_USERNAME>` },
    { cmd: `davcli ftp-path`, desc: `Change FTP path for a user.`, usage: `davcli ftp-path <username> <path> <davpanel_username> [--debug]` },
    { cmd: `davcli ftp-logs`, desc: `View the FTP server log`, usage: `davcli ftp-log` },
    { cmd: `davcli ftp-connections`, desc: `Display all active FTP connection or for particular DavPanel user.`, usage: `davcli ftp-add <NEW_USERNAME> <NEW_PASSWORD> <FOLDER> <DAVPANEL_USERNAME>` },
    { cmd: `davcli ftp-list`, desc: `List FTP sub-users for davpanel user.`, usage: `davcli ftp-list <DAVPANEL_USERNAME> [--json]` },
    { cmd: `davcli ftp-password`, desc: `Change password for FTP sub-user of davpanel user.`, usage: `davcli ftp-password <username> <new_password> <davpanel_username> [--debug]` },
    { cmd: `davcli version`, desc: `Displays the current (installed) version of DavPanel container image.`, usage: `davcli version` },
    { cmd: `davcli domain`, desc: `View and set domain/ip for accessing panels.`, usage: `davcli domain [set <domain_name> | ip] [--debug]` },
    { cmd: `davcli docker-autostart`, desc: `Set services to auto-start for user on acocunt creation.`, usage: `davcli docker-autostart` },
    { cmd: `davcli docker-collect_stats`, desc: `Collect resource usage information for user(s).`, usage: `davcli docker-collect_stats` },
    { cmd: `davcli docker-logs`, desc: `Display log sizes for user and sytem containers`, usage: `davcli docker-logs [--all|system|<USERNAME>]` },
    { cmd: `davcli docker-backup`, desc: `Generates a backup for all users.`, usage: `davcli docker-backup` },
    { cmd: `davcli docker-images`, desc: `Check and auto-update container images per user.`, usage: `davcli docker-images [--all|<USERNAME>] [--dry-run] [--force-update]` },
    { cmd: `davcli docker-limits`, desc: `Set global container limits for all containers combined.`, usage: `davcli docker-limits [--apply | --apply SIZE | --read]` },
    { cmd: `davcli server-logrotate`, desc: `Configures logrotate for caddy, davpanel, syslog.`, usage: `davcli server-logrotate` },
    { cmd: `davcli server-migrate`, desc: `Migrates all data from this server to another.`, usage: `davcli server-migrate -h <DESTINATION_IP> --user root --password <DESTINATION_PASSWORD>` },
    { cmd: `davcli patch`, desc: `Download and install a patch`, usage: `davcli patch <NAME>` },
    { cmd: `davcli sentinel`, desc: `Check system services, traffic and resource usage.`, usage: `davcli sentinel` },
    { cmd: `davcli email-ratelimit`, desc: `Configure rate-limiting using postfwd for domains and users.`, usage: `davcli email-ratelimit` },
    { cmd: `davcli email-server`, desc: `Manage mailserver`, usage: `davcli email-server <install|start|restart|stop|uninstall> [--debug]` },
    { cmd: `davcli email-setup`, desc: `Setup email addresses, forwarders, filters..`, usage: `davcli email-setup <COMMAND> <ATTRIBUTES>` },
    { cmd: `davcli email-webmail`, desc: `Display webmail domain or choose webmail software`, usage: `davcli email-webmail [--debug]` },
    { cmd: `davcli email-manage`, desc: `Manage mailserver configuration and overview.`, usage: `davcli email-manage <COMMAND> <ATTRIBUTES>` },
    { cmd: `davcli email-quotas`, desc: `Fixes email permission issues for all domains.`, usage: `davcli email-quotas` },
    { cmd: `davcli api`, desc: `On/Off DavAdmin API access and list available API endpoints.`, usage: `davcli api <status|on|off|list>` },
    { cmd: `davcli plan-delete`, desc: `Delete hosting plan`, usage: `davcli plan-delete <PLAN_NAME>` },
    { cmd: `davcli plan-apply`, desc: `Change plan for a user and apply new plan limits.`, usage: `davcli plan-apply <NEW_PLAN_ID> <USERNAME>` },
    { cmd: `davcli plan-edit`, desc: `Edit an existing hosting plan (Package) and modify its parameters.`, usage: `davcli plan-edit --debug id=<ID> name"<TEXT>" description="<TEXT>" emails=<COUNT> ftp=<COUNT> domains=<COUNT> websites=<COUNT> disk=<COUNT> inodes=<COUNT> databases=<COUNT> cpu=<COUNT> ram=<COUNT> bandwidth=<COUNT> feature_set=<DEFAULT> max_email_quota=<COUNT> max_hourly_email=<COUNT>` },
    { cmd: `davcli plan-list`, desc: `Display all plans: id, name, description, limits..`, usage: `davcli plan-list [--json]` },
    { cmd: `davcli plan-create`, desc: `Create a new hosting plan (Package) and set its limits.`, usage: `davcli plan-create name"<TEXT>" description="<TEXT>" emails=<COUNT> ftp=<COUNT> domains=<COUNT> websites=<COUNT> disk=<COUNT> inodes=<COUNT> databases=<COUNT> cpu=<COUNT> ram=<COUNT> bandwidth=<COUNT> feature_set=<NAME> max_email_quota=<COUNT> max_hourly_email=<COUNT>` },
    { cmd: `davcli plan-usage`, desc: `Display all users that are currently using the plan.`, usage: `davcli plan-usage <PLAN_NAME> [--json]` },
    { cmd: `davcli config`, desc: `View / change configuration for users and set defaults for new accounts.`, usage: `davcli config get <setting_name>` },
    { cmd: `davcli phpmyadmin`, desc: `View and set domain/ip for phpmyadmin access.`, usage: `davcli phpmyadmin [set <domain_name> | ip]` },
    { cmd: `davcli error`, desc: `Displays information for specific error ID received in DavPanel UI.`, usage: `davcli error <ID_HERE>` },
    { cmd: `davcli locale`, desc: `Install locales (Languages) for DavPanel UI.`, usage: `davcli locale <CODE>` },
];

const CommandBlock = ({
    cmd,
    desc,
    usage,
}: {
    cmd: string;
    desc: string;
    usage: string;
}) => (
    <div className={clsx("px-6", "py-3")}>
        <div className={clsx("flex", "items-baseline", "gap-2")}>
            <span className={clsx("text-refine-cyan-alt")}>$</span>
            <span className={clsx("text-gray-0", "font-semibold")}>{cmd}</span>
        </div>
        <div className={clsx("pl-4", "text-gray-500")}>
            <span>Description: </span>
            <span className={clsx("text-gray-400")}>{desc}</span>
        </div>
        <div className={clsx("pl-4", "text-gray-500")}>
            <span>Usage: </span>
            <span className={clsx("text-gray-400")}>{usage}</span>
        </div>
    </div>
);

const CommandList = () => (
    <div>
        {DAVCLI_COMMANDS.map((command) => (
            <CommandBlock key={command.cmd} {...command} />
        ))}
    </div>
);

export const LandingHeroShowcaseDavCliTerminal = ({ className }: Props) => {
    return (
        <div
            className={clsx(
                className,
                "h-full",
                "flex",
                "flex-col",
                "bg-gray-900",
                "overflow-hidden",
            )}
        >
            <div
                className={clsx(
                    "shrink-0",
                    "h-10",
                    "flex",
                    "items-center",
                    "gap-1.5",
                    "px-4",
                    "bg-[#1B1B29]",
                )}
            >
                <span
                    className={clsx("w-2.5 h-2.5 rounded-full")}
                    style={{ background: "#FF5F57" }}
                />
                <span
                    className={clsx("w-2.5 h-2.5 rounded-full")}
                    style={{ background: "#FEBC2E" }}
                />
                <span
                    className={clsx("w-2.5 h-2.5 rounded-full")}
                    style={{ background: "#28C840" }}
                />
                <span
                    className={clsx(
                        "flex-1",
                        "text-center",
                        "text-gray-400",
                        "text-xs",
                        "font-jetBrains-mono",
                        "pr-8",
                    )}
                >
                    root@server: /davcli
                </span>
            </div>
            <div
                className={clsx(
                    "flex-1",
                    "overflow-hidden",
                    "relative",
                    "landing-davcli-terminal-mask",
                )}
            >
                <div
                    className={clsx(
                        "animate-davcli-scroll",
                        "will-change-transform",
                        "text-[11px] landing-sm:text-xs",
                        "leading-[17px]",
                        "font-jetBrains-mono",
                        "select-none",
                    )}
                >
                    <CommandList />
                    <CommandList />
                </div>
            </div>
        </div>
    );
};
