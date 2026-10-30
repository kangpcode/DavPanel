# DavPanel and WHMCS

DavPanel Enterprise edition has billing integrations with WHMCS and [FOSSBilling](/docs/articles/extensions/davpanel-and-fossbilling).

DavPanel WHMCS module allows users to integrate billing automations with their DavPanel server.

# DavPanel 

To setup WHMCS to use your DavPanel server follow these steps:

## Enable API

First make sure that API access is enabled by going to `DavAdmin > API` or by running `davcli config get api` from the terminal:
![enable_api](https://i.postimg.cc/L6vwMQ4t/image.png)
If API is not enabled, click on the "Enable API access" button or from terminal run 
```bash
davcli config update api on
```

We recommend creating new Administrator user for API, to create a new user navigate to *DavAdmin > DavAdmin Settings* and create new admin user, or from terminal run:
```bash
davcli admin new USERNAME_HERE PASSWORD_HERE
```

## Whitelist on DavPanel

On DavPanel server make sure that the DavAdmin port 2087 is open on `DavAdmin > Firewall` or whitelist the IP adress of your WHMCS server.
to whitelist ip address from terminal run:

```bash
csf -a WHMCS_IP_HERE
```
or if using UFS:
```bash
ufw allow from WHMCS_IP_HERE
```

## Create hosting package
Hosting packages need to be created on both DavPanel and WHMCS servers.
On DavPanel server login to admin panel and on `DavAdmin > Plans` create hosting packages that you will be assinging to users on WHMCS.

# WHMCS

## Install DavPanel WHMC Module

Login to SSH for WHMCS server
Navigate to `path_to_whmcs/modules/servers`
Run this command to create a new folder and in it download the module:
```bash
git clone https://github.com/stefanpejcic/openpanel-whmcs-module.git davpanel
```

## Whitelist on WHMCS

On WHMCS server also make sure that the 2087 port is opened or whitelist the IP address of your DavPanel server.

## WHMCS Module Setup

From WHMS navigate to: *System Settings > Products & Services > Servers*
![screenshot](https://i.postimg.cc/MHWpL3tc/image.png)
Click on *Create New Server* and under module select **DavPanel** then add DavPanel server IP, username and password for the DavAdmin panel:
![create_whmcs_group](https://i.postimg.cc/3Jh3nqWY/image.png)

## Create hosting package
On the WHMCS server create first a new group and then create new plans under this group. When creating products, make sure to select DavPanel for Module and the newly created group
![screenshot2](https://i.postimg.cc/NLvF4GSc/image.png)

## Test
Create an order and create a new order to test DavPanel API.
