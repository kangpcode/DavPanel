---
sidebar_position: 1
---

# General Settings

From this page Administrators can configure the domain to access both DavPanel and DavAdmin interfaces, as well as ports for those services.

![davadmin general panel settings](/img/admin/adminpanel_general_settings.png)

## Domain

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
   Set the domain name in *DavAdmin > Settings > General Settings*.

:::info
You can also [set a separate domain just for DavPanel UI](/docs/articles/dev-experience/separate-domain-for-davpanel-access)
:::

## Set IP address for DavPanel

To access DavPanel and DavAdmin via server public IP address, set IP address in *DavAdmin > Settings > General Settings*.

## Ports

Port configurations for DavAdmin and DavPanel interfaces can be modified from their default settings (`2087` for DavAdmin and `2083` for DavPanel). 

- To change the port for the DavPanel from the default `2083` to another value, set the desired port in the "DavPanel Port" field.
- To change the port for the DavAdmin from the default `2087` to another value, set the desired port in the "DavAdmin Port" field.

## Redirect

By default, when users add a domain, the addition of "/davpanel" to the domain URL will redirect them to the DavPanel interface. However, you have the flexibility to customize this, such as changing it to "/awesome," allowing users to access their DavPanel via "their-domain.com/awesome".

To change the "/davpanel" to something else, simply set the value for the "DavPanel is also available on:" field and click on save. Changes take effect instantly without service interruption.

