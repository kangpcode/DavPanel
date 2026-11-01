---
sidebar_position: 1
---

# Get Started

The DavAdmin offers an administrator-level interface where you can efficiently handle tasks such as creating and managing users, setting up hosting plans, enabling features, and editing DavPanel settings.

## Requirements

Minimum Requirements:

- A blank full virtual machine or bare metal server
- Minimum of 1GB RAM and 20GB storage (4GB RAM and 50GB is recommended)
- AMD64(x86_64) or ARM(AArch64) architecture
- IPv4 address

Supported operating systems:
- **Ubuntu 22, 24, 26** (24.04 is recommended)
- **Debian 10, 11, 12, 13**
- **AlmaLinux 9.5 and 10** (9.5 is recommended for ARM CPU, 10 has a known issue [#744](https://github.com/stefanpejcic/OpenPanel/issues/744))
- **RockyLinux 9.6, 10**
- **CentOS 9.5**

On AlmaLinux 10 and RockyLinux 10, you must switch from `nftables` to `iptables`. See [#1472](https://github.com/docker/for-linux/issues/1472) and [#745](https://github.com/stefanpejcic/OpenPanel/issues/745#issuecomment-3451272947).

:::info
If you are using external firewall, the following ports should be opened: 
- for dns: `53`
- for email: `25` `465` `993`
- for websites: `80` `443`
- for panels: `2083` `2087` 
- for phpmyadmin: `2053` `8888`
- for user services:  `32768:60999`
:::

## Installation

DavPanel can be installed on both VPS and bare-metal servers. 

The installation process takes about 5 minutes. To install davpanel follow these steps: 

<Tabs>
  <TabItem value="davpanel-install-on-dedicated" label="Install script" default>

1. Log in to your new server;
- as root via SSH or
- as a user with sudo privileges and type "sudo -i"
2. Copy and paste davpanel installation command into the terminal
```shell
curl -fsSL https://raw.githubusercontent.com/kangpcode/DavPanel/main/bootstrap.sh -o /tmp/davpanel-bootstrap.sh && bash /tmp/davpanel-bootstrap.sh
```

The installation script supports [optional flags](/install) that can be used to configure davpanel, skip certain installation steps or simply display debugging information.

If you encountered any errors while running the installation script, please copy & paste the installation log file to [the community forums](https://community.davpanel.org).

  </TabItem>
  <TabItem value="davpanel-install-on-cloud" label="Cloud">

[Amazon Web Services (AWS)](/docs/articles/install-update/install-on-aws)

[DigitalOcean](/docs/articles/install-update/install-on-digitalocean)

[Google Cloud Platform (GCP)](/docs/articles/install-update/install-on-google-cloud)

[Microsoft Azure](/docs/articles/install-update/install-on-microsoft-azure)

[Vultr](/docs/articles/install-update/install-on-vultr)
    
  </TabItem>
  <TabItem value="davpanel-install-on-other" label="Other">

[CloudInit](/docs/articles/install-update/install-using-cloudinit)

[Ansible](/docs/articles/install-update/install-using-ansible)

[Virtualizor](/docs/articles/install-update/install-on-virtualizor)

  </TabItem>  
</Tabs>


## Post Install Steps

Recommended steps after installing DavPanel:
- [Access the DavAdmin panel](/docs/articles/dev-experience/how-to-access-davadmin)
- [Configure Domain and SSL for DavPanel](/docs/admin/settings/general/#domain)
- [Enable Modules (features) in DavPanel UI](/docs/admin/settings/modules/)
- [Configure Custom Nameservers](/docs/articles/domains/how-to-configure-nameservers-in-davpanel/)
- [Create Hosting Packages](/docs/admin/plans/hosting_plans#create-a-plan)
- [Create New User Accounts](/docs/admin/accounts/users/#create-users)
- [Set Email address to receive Alerts](/docs/admin/settings/notifications/#email)
- [Change Update Preferences](/docs/admin/settings/updates)
- [Secure DavPanel for Production Use](/docs/articles/security/securing-davpanel/)

DavAdmin is available on port `2087` of your server (for example `https://server.example.com:2087`):

![DavAdmin login form with the username and password fields, Remember me, passkey sign-in and the Switch to DavPanel button](/img/davadmin-screenshots/000_intro-login.png#gh-light-mode-only)
![DavAdmin login form with the username and password fields, Remember me, passkey sign-in and the Switch to DavPanel button](/img/davadmin-screenshots/000_intro-login_dark.png#gh-dark-mode-only)
