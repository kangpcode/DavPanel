---
sidebar_position: 1
---

# Get Started

The DavAdmin offers an administrator-level interface where you can efficiently handle tasks such as creating and managing users, setting up hosting plans, enabling features, and editing DavPanel settings.

## Requirements

Minimum Requirements:

- A blank full virtual machine or bare metal server
- Minimum of 1GB RAM and 20GB storage (4GB RAM and 50GB is recommended)
- AMD64 (x86_64) or ARM64 (AArch64) release build; native ARM64 hosting remains unverified
- IPv4 address

Not sure how big the server should be? See [System Requirements & Sizing](/docs/articles/install-update/system-requirements/) or use the [resource calculator](/calculator).

### Supported OS versions

Updated: 2026-11-01. Both editions use the same OS installer paths.

| Distribution | Release targets | Installer status |
| --- | --- | --- |
| Ubuntu Server | 22.04, 24.04, 26.04 LTS | APT path implemented |
| Debian | 12, 13 | APT path implemented |
| AlmaLinux | 9.x, 10.x | DNF path implemented; use the latest minor release |
| Rocky Linux | 9.x, 10.x | DNF path implemented; currently requires `--skip-firewall` and a separately configured firewall |
| Oracle Linux | 10.x | DNF/EPEL 10 path; Oracle Linux 9 needs a separate EPEL path and is not a current installation target |
| CentOS Stream | 9, 10 | RPM path implemented |
| Fedora / openEuler | Maintained releases | Experimental installer branches |

**Complete clean-server installation remains unverified for this fork on every
OS/version listed above.** Source checks, release builds and container smoke tests
do not establish that account provisioning, quotas, networking and backups work
on a target server. The [repository platform matrix](https://github.com/kangpcode/DavPanel/blob/main/PLATFORMS.md)
records restrictions, release references and acceptance checks.

Debian 10/11 and CentOS Linux 7/8 are not targets for new installations. Native
Windows/macOS hosting and hosting inside Codespaces, Docker, Podman, LXC or
OpenVZ containers are unsupported. Use Codespaces for development and release
builds, then install on a clean Linux VM/VPS or bare metal server.

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

Installation time depends on the server and network; a source build also compiles
both Go binaries. To install DavPanel follow these steps:

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

If you encountered any errors while running the installation script, please copy & paste the installation log file to [GitHub Discussions](https://github.com/stefanpejcic/OpenPanel/discussions).

![DavPanel installer output in a terminal: the DavPanel banner with version, OS, IP and Podman engine, each installation step marked OK, and the DavAdmin URL with the generated username and password at the end](/img/davpanel-screenshots/install/installer-output-generic.png#screenshot)

  </TabItem>
  <TabItem value="davpanel-install-on-cloud" label="Cloud">

[Amazon Web Services (AWS)](/docs/articles/install-update/install-on-aws)

[Contabo](/docs/articles/install-update/install-on-contabo)

[DigitalOcean](/docs/articles/install-update/install-on-digitalocean)

[Google Cloud Platform (GCP)](/docs/articles/install-update/install-on-google-cloud)

[Hetzner](/docs/articles/install-update/install-on-hetzner)

[Linode (Akamai Cloud)](/docs/articles/install-update/install-on-linode)

[Microsoft Azure](/docs/articles/install-update/install-on-microsoft-azure)

[OVHcloud](/docs/articles/install-update/install-on-ovh)

[Oracle Cloud (Always Free)](/docs/articles/install-update/install-on-oracle-cloud)

[Vultr](/docs/articles/install-update/install-on-vultr)
    
  </TabItem>
  <TabItem value="davpanel-install-on-other" label="Other">

[CloudInit](/docs/articles/install-update/install-using-cloudinit)

[Ansible](/docs/articles/install-update/install-using-ansible)

[Proxmox VE](/docs/articles/install-update/install-on-proxmox)

[Home Server](/docs/articles/install-update/install-on-home-server)

[Raspberry Pi](/docs/articles/install-update/install-on-raspberry-pi)

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
- [Manage User Containers from the Terminal](/docs/articles/containers/context/)

DavAdmin is available on port `2087` of your server (for example `https://server.example.com:2087`):

![DavAdmin login form with the username and password fields, Remember me, passkey sign-in and the Switch to DavPanel button](/img/davadmin-screenshots/000_intro-login.png#gh-light-mode-only)
![DavAdmin login form with the username and password fields, Remember me, passkey sign-in and the Switch to DavPanel button](/img/davadmin-screenshots/000_intro-login_dark.png#gh-dark-mode-only)
