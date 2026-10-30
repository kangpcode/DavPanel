---
sidebar_position: 1
---

# General Settings

From this page Administrators can configure the domain to access both DavPanel and DavAdmin interfaces, as well as ports for those services.

## Domain

Both DavAdmin and DavPanel are accessed through the same single **Hostname** field: enter either a domain name or the server's IP address there, and both interfaces become reachable at `https://HOSTNAME:PORT/`.

![Domain section of General Settings with the hostname field](/img/davadmin-screenshots/settings/general-domain.png#gh-light-mode-only)
![Domain section of General Settings with the hostname field](/img/davadmin-screenshots/settings/general-domain_dark.png#gh-dark-mode-only)

If the Hostname is an IP address, a recommendation is shown to use a domain instead if the mail server will be used, since the hostname is also used for the SSL certificate on SMTP.

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
   Set the domain name in the **Hostname** field on *DavAdmin > Settings > General*.

:::info
You can also [set a separate domain just for DavPanel UI](/docs/articles/dev-experience/separate-domain-for-davpanel-access)
:::

The **SSL** row below the hostname shows the current SSL status of the panel domain; **Manage SSL** opens its certificate page.

![SSL section of General Settings with the current SSL status and the Manage SSL button](/img/davadmin-screenshots/settings/general-ssl.png#gh-light-mode-only)
![SSL section of General Settings with the current SSL status and the Manage SSL button](/img/davadmin-screenshots/settings/general-ssl_dark.png#gh-dark-mode-only)

## Set IP address for DavPanel

To access DavPanel and DavAdmin via the server's public IP address, enter the IP address in the same **Hostname** field in *DavAdmin > Settings > General* (this field accepts either a domain name or an IP address).

## Ports

Port configurations for DavAdmin and DavPanel interfaces can be modified from their default settings (`2087` for DavAdmin and `2083` for DavPanel). 

![Ports section of General Settings with the DavAdmin and DavPanel ports](/img/davadmin-screenshots/settings/general-ports.png#gh-light-mode-only)
![Ports section of General Settings with the DavAdmin and DavPanel ports](/img/davadmin-screenshots/settings/general-ports_dark.png#gh-dark-mode-only)

- To change the port for the DavPanel from the default `2083` to another value, set the desired port in the "DavPanel port" field.
- To change the port for the DavAdmin from the default `2087` to another value, set the desired port in the "DavAdmin port" field.

## Redirect

By default, when users add a domain, the addition of "/davpanel" to the domain URL will redirect them to the DavPanel interface. However, you have the flexibility to customize this, such as changing it to "/awesome," allowing users to access their DavPanel via "their-domain.com/awesome".

![Redirect section of General Settings with the /davpanel redirect name](/img/davadmin-screenshots/settings/general-redirect.png#gh-light-mode-only)
![Redirect section of General Settings with the /davpanel redirect name](/img/davadmin-screenshots/settings/general-redirect_dark.png#gh-dark-mode-only)

To change the "/davpanel" to something else, simply set the value in the "/davpanel" field and click on save. Changes take effect instantly without service interruption.

## Debugging (Dev Mode)

Toggle **Dev mode** to enable verbose/detailed logging for DavPanel and DavAdmin, useful for error diagnostics. Logs can be viewed under *DavAdmin > Services > Log Files*.

![Debugging (Dev Mode) section of General Settings with the Dev mode toggle](/img/davadmin-screenshots/settings/general-debug.png#gh-light-mode-only)
![Debugging (Dev Mode) section of General Settings with the Dev mode toggle](/img/davadmin-screenshots/settings/general-debug_dark.png#gh-dark-mode-only)

:::info
After saving, an DavAdmin restart is needed for the new value to take effect.
:::

