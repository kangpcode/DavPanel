---
sidebar_position: 1
---

# General Settings

Change ports, domain, enable ssl, etc.

![davadmin general panel settings](/img/admin/adminpanel_general_settings.png)

The General Settings page enables you to edit settings that affect both admin and user panel:

- domain to access panels
- ports to be used
- update preferences

## Set domain for DavPanel

To enable access to both DavAdmin and DavPanel through a domain name, such as srv.your-domain.com:2083, follow these three steps:

1. Set hostname:
   Set the desired subdomain as server hostname:
   ```
   hostnamectl set-hostname server.example.net
   ```
2. Configure DNS:
   Point the subdomain to the public IP of the server.
   Use a tool such as https://www.whatsmydns.net/ to check that domain is pointed to server ip.
   
3. Set in General Settings
   Switch from IP to the domain name in *DavAdmin > General Settings*.

![davadmin set_domainname](/img/admin/adminpanel_domainname.png)

## Set IP address for DavPanel

To access DavPanel and DavAdmin via server public IP address, choose the "Server IP address" option and click save. The modification is immediate, redirecting you to the designated IP:2087 for the admin panel upon saving.

![davadmin set ip](/img/admin/adminpanel_serverip.png)

## Change DavPanel port

Port configurations for DavAdmin and DavPanel interfaces can be modified from their default settings (2087 for DavAdmin and 2083 for DavPanel). 

![davadmin set port for davpanel](/img/admin/davpanel_settings.png)

To change the port for the DavPanel from the default `2083` to another value, you can easily set the desired port in the "DavPanel Port" field.
It's important to note that the port must fall within the range of 1000-33000.

## Change DavAdmin port

:::info
NOTE: Changing admin port from 2087 is currently not possible, as external tools such as WHMCS do not have option to set custom port.
:::

![davadmin set port for davadmin](/img/admin/davadmin_settings.png)


# Force HTTPS

Enabling the "Force HTTPS" option ensures that the panels are accessible via HTTPS, recommended for enhanced security features like CORS and header checks in the DavPanel interface.
To activate HTTPS, select the "Force HTTPS" option; to deactivate, simply uncheck it.

# Change /davpanel

By default, when users add a domain, the addition of "/davpanel" to the domain URL will redirect them to the DavPanel interface. However, you have the flexibility to customize this, such as changing it to "/awesome," allowing users to access their DavPanel via "their-domain.com/awesome".

To change the "/davpanel" to something else, simply set the value for the "DavPanel is also available on:" field and click on save. Changes take effect instantly without service interruption.
![davadmin set custom path](/img/admin/davpanel_settings_available_on_davpanel.png)

## Enable Updates

The Update Preferences section provides the option to enable or disable Auto updates and Auto patches. Patches involve minor updates aimed at fixing bugs without introducing new features. On the other hand, Updates encompass major updates that introduce new features, potentially impacting existing functionality.

![davadmin set update preferences](/img/admin/davpanel_settings_updates.png)

Examples:
- Autoupdate: 1.0.2 will **NOT** be updated to 1.0.3 BUT 1.0.2 will be updated to 2.0.0
- Autopatch:  1.0.2 will be updated to 1.0.3 BUT 1.0.2 will **NOT** be updated to 2.0.0
