# Securing DavPanel

This section describes the best practices and settings that can increase the security of your DavPanel server and, thus, protect it from various types of attacks and loss of sensitive data:

For Server Administrators (DavAdmin):

- [Enable Basic Access Authentication for DavAdmin](/docs/admin/security/basic_auth/)
- [Configure CorazaWAF rules](/docs/admin/security/waf/)
- [Change DavPanel or DavAdmin ports](/docs/admin/settings/general/#ports)
- [Restrict access to DavAdmin](/docs/articles/dev-experience/limit_access_to_davadmin/)
- [Check passwords against weakpass.com lists](/docs/admin/settings/davpanel/#display)
- [Changing the DavPanel Administrator Username](/docs/admin/accounts/administrators/#create-new-admin)
- [Securing DavPanel and the Mail Server With SSL/TLS Certificates](/docs/admin/settings/general/#domain)
- [Restricting access to Features based on Hosting Plans](/docs/admin/plans/feature-manager/#use-cases)
- [Setup Fail2ban for email](/docs/articles/email/how-to-setup-fail2ban-mailserver-davpanel/)
- [Setup DKIM for emails](/docs/articles/email/how-to-setup-dkim-for-mailserver/)
- [Setup ImunifyAV](/docs/articles/security/setup-imunifyav/)
- [Enable CSF Blocklists](/docs/articles/security/csf-blocklists/)
- [Limiting Connections with CSF](/docs/articles/security/how-to-limit-connections-csf/)
- [Rate-limiting failed Davpanel logins](/docs/articles/dev-experience/rate_limiting_for_davpanel/)
- [Change SSH root user password](/docs/admin/advanced/root-password/)
- [Change SSH port](/docs/admin/advanced/ssh/#basic-ssh-settings)
- [Configure SSH Keys](/docs/admin/advanced/ssh/#authorized-keys)
- [Disable Terminal in DavAdmin](/docs/articles/dev-experience/disable-davadmin-web-terminal/)
- [Disable Server Reboot in DavAdmin](/docs/articles/dev-experience/disable-davadmin-server-reboot/)
- [Disable DavAdmin access](/docs/admin/security/disable-admin/)

For Website Administrators (DavPanel):
- [Enabling WAF protection per domain](/docs/panel/advanced/waf/)
- [Configure Automatic Backups](/docs/panel/files/backups/)
- [Fix Files Permissions](/docs/panel/files/fix_permissions/)
- [Scan website files for Malware](/docs/panel/files/malware-scanner/)
- [Suspend a Compromised Website](/docs/panel/domains/suspend/)
- [Setting up Multi-Factor Authentication in DavPanel](/docs/panel/account/2fa/)
- [Configure Automatic SSL](/docs/panel/domains/ssl/#autossl)
- [Reviewing Account activity log](/docs/panel/account/account_activity/)
- [Reviewing Active Sessions](/docs/panel/account/active_sessions/)
- [Viewing Login History](/docs/panel/account/login_history/)
