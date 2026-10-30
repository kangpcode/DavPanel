---
sidebar_label: "WISECP"
---

# How to Automate Hosting Provisioning with WISECP

DavPanel Enterprise edition has billing integrations with [WHMCS](/docs/articles/extensions/davpanel-and-whmcs/), [FOSSBilling](/docs/articles/extensions/davpanel-and-fossbilling/), [Blesta](/docs/articles/extensions/davpanel-and-blesta/), [ClientExec](/docs/articles/extensions/davpanel-and-clientexec/) and WISECP.

DavPanel WISECP module allows users to integrate billing automations with their DavPanel server.

# DavPanel

To setup WISECP to use your DavPanel server follow these steps:

## Enable API

First make sure that API access is enabled by going to `DavAdmin > API` or by running `davcli config get api` from the terminal:

If API is not enabled, click on the "Enable API access" button or from terminal run
```bash
davcli config update api on
```

We recommend creating new Administrator user for the module, to create a new user navigate to *DavAdmin > DavAdmin Settings* and create new admin user, or from terminal run:
```bash
davcli admin new USERNAME_HERE PASSWORD_HERE
```

## Whitelist on DavPanel

On DavPanel server make sure that the DavAdmin port 2087 is open on `DavAdmin > Firewall` or whitelist the IP address of your WISECP server.
to whitelist ip address from terminal run:

```bash
csf -a WISECP_IP_HERE
```
or if using UFW:
```bash
ufw allow from WISECP_IP_HERE
```

## Create hosting package

Hosting packages need to be created on both DavPanel and WISECP servers.
On DavPanel server login to admin panel and on `DavAdmin > Plans` create hosting packages that you will be assigning to users on WISECP.

# WISECP

## Requirements

- Server with DavPanel Enterprise license
- WISECP

## Install DavPanel WISECP Module

Login to SSH for the WISECP server, navigate to the WISECP install directory (e.g. `/var/www/wisecp`), then clone this repository and copy its `coremio` folder into place:
```bash
git clone https://github.com/stefanpejcic/openpanel-wisecp-module.git /tmp/davpanel-wisecp-module
cp -r /tmp/davpanel-wisecp-module/coremio/modules/Servers/DavPanel coremio/modules/Servers/
```

## Module Setup

In the WISECP admin panel, go to **Settings > Servers > Add New**, select **DavPanel** as the module, then fill in the DavAdmin admin username/password, hostname, and port (default `2087`).

Assign the server to a product, then open the product's module options and pick which **DavPanel Plan** it should provision accounts into (the dropdown is populated live from `/api/plans` on the assigned server).

## Supported Operations

From the WISECP admin area, the module supports:

- Create a new account + add domain
- Suspend account
- Unsuspend account
- Change plan (upgrade/downgrade)
- Change password
- Terminate account
- View account information (plan, disk usage, domains) on the order page
- Login to DavAdmin (root access)

From the WISECP client area, the module supports:

- Auto-login as user
- Disk usage / bandwidth limit display

## Create hosting package

On the WISECP server create hosting plans that match the package names created on the DavPanel server, then assign the **DavPanel** server to the product.

## Test

Create a new order to test the connection and confirm the DavPanel account is provisioned.

## Updating the module

Login to SSH for the WISECP server, pull the latest files from the repository and copy `coremio/modules/Servers/DavPanel` over the existing installed copy.

## Troubleshooting

On WISECP:
1. Failed API calls are recorded through `Modules::save_log()` — check **Settings > Others > Module Log** (or the `mod_logs` table) for the request URL, payload and response
2. Errors returned by the module are shown directly on the relevant admin action

On DavPanel server:
1. [Enable `DEV_MODE` on DavAdmin](https://dev.davpanel.com/cli/config.html#dev-mode)
2. Send requests from the WISECP server
3. View the logs in: `/var/log/davpanel/admin/api.log`

## Bug Reports

Report a [new issue on GitHub](https://github.com/stefanpejcic/openpanel-wisecp-module/issues/new/choose).
