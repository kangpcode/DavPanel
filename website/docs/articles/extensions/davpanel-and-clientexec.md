---
sidebar_label: "ClientExec"
---

# How to Automate Hosting Provisioning with ClientExec

DavPanel Enterprise edition has billing integrations with [WHMCS](/docs/articles/extensions/davpanel-and-whmcs/), [FOSSBilling](/docs/articles/extensions/davpanel-and-fossbilling/), [Blesta](/docs/articles/extensions/davpanel-and-blesta/), ClientExec and [WISECP](/docs/articles/extensions/davpanel-and-wisecp/).

DavPanel ClientExec plugin allows users to integrate billing automations with their DavPanel server.

# DavPanel

To setup ClientExec to use your DavPanel server follow these steps:

## Enable API

First make sure that API access is enabled by going to `DavAdmin > API` or by running `davcli config get api` from the terminal:

If API is not enabled, click on the "Enable API access" button or from terminal run
```bash
davcli config update api on
```

We recommend creating new Administrator user for the plugin, to create a new user navigate to *DavAdmin > DavAdmin Settings* and create new admin user, or from terminal run:
```bash
davcli admin new USERNAME_HERE PASSWORD_HERE
```

## Whitelist on DavPanel

On DavPanel server make sure that the DavAdmin port 2087 is open on `DavAdmin > Firewall` or whitelist the IP address of your ClientExec server.
to whitelist ip address from terminal run:

```bash
csf -a CLIENTEXEC_IP_HERE
```
or if using UFW:
```bash
ufw allow from CLIENTEXEC_IP_HERE
```

## Create hosting package

Hosting packages need to be created on both DavPanel and ClientExec servers.
On DavPanel server login to admin panel and on `DavAdmin > Plans` create hosting packages that you will be assigning to users on ClientExec.

# ClientExec

## Requirements

- Server with DavPanel Enterprise license
- ClientExec

## Install DavPanel ClientExec Plugin

Login to SSH for the ClientExec server, navigate to `path_to_clientexec/plugins/server` and run this command to create a new folder and in it download the plugin:
```bash
git clone https://github.com/stefanpejcic/openpanel-clientexec.git davpanel
```

## Plugin Setup

In ClientExec admin, add a new server and select the **DavPanel** plugin, then fill in the DavAdmin admin username/password, hostname, and port (default `2087`).

## Supported Operations

From the ClientExec admin area, the plugin supports:

- Create a new user account + add domain
- Suspend account
- Unsuspend account
- Change package
- Change password
- Terminate account
- Test connection

## Create hosting package

On the ClientExec server create hosting plans that match the package names created on the DavPanel server, then assign the **DavPanel** server to the product.

## Test

Create a new order to test the connection and confirm the DavPanel account is provisioned.

## Updating the plugin

Login to SSH for the ClientExec server, navigate to `path_to_clientexec/plugins/server/davpanel` and run:
```bash
git pull
```

## Troubleshooting

On ClientExec:
1. Enable debug logging for the server module and reproduce the action
2. Check the module log in the ClientExec admin area

On DavPanel server:
1. [Enable `DEV_MODE` on DavAdmin](https://dev.davpanel.com/cli/config.html#dev-mode)
2. Send requests from the ClientExec server
3. View the logs in: `/var/log/davpanel/admin/api.log`

## Bug Reports

Report a [new issue on GitHub](https://github.com/stefanpejcic/openpanel-clientexec/issues/new/choose).
