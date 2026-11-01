---
sidebar_label: "DavPanel Installation on Vultr"
---

# How to Install a Hosting Control Panel on Vultr

This guide will walk you through deploying **DavPanel** on a Vultr instance with Ubuntu.

---

## Prerequisites

- An active [Vultr account](https://www.vultr.com/).
- Basic familiarity with SSH and terminal commands.

---

## Step 1: Create a Vultr Instance

1. Log in to your **Vultr account**.
2. Click **Products → Deploy New Instance**.
3. Choose a **server location** near your users.
4. Select an **OS image**:
   - Ubuntu 24.04
5. Choose a **server size** meeting minimum requirements:
   - **1 CPU, 2 GB RAM** (recommended: `Cloud Compute` or equivalent)
6. Configure **SSH key authentication** (recommended) and add your public key.
7. Complete the instance creation.

---

## Step 2: Connect to Your Instance

Use SSH to connect:

```bash
ssh root@yourInstanceIp
```

> Replace `yourInstanceIp` with the public IP of your Vultr instance.

![Terminal showing the first SSH connection as root: confirming the server's host key fingerprint, the Ubuntu 24.04 welcome message, and the root prompt](/img/davpanel-screenshots/install/ssh-vultr.png#screenshot)

---

## Step 3: Run the DavPanel Installer

Run the installation script:

```bash
curl -fsSL https://raw.githubusercontent.com/kangpcode/DavPanel/main/bootstrap.sh -o /tmp/davpanel-bootstrap.sh && bash /tmp/davpanel-bootstrap.sh
```

The installer runs without any prompts and takes about 5 minutes. When it finishes, it prints the **DavAdmin URL**, **username** and **password**.

![DavPanel installer output in a terminal: the DavPanel banner with version, OS, IP and Podman engine, each installation step marked OK, and the DavAdmin URL with the generated username and password at the end](/img/davpanel-screenshots/install/installer-output-generic.png#screenshot)

---

## Step 4: Access DavPanel

1. Open your browser and navigate to:

```
https://yourInstanceIp:2087
```

2. Log in using the credentials created during installation.

---

## Notes

* Ensure your Vultr instance meets [DavPanel minimum requirements](https://davpanel.com/docs/admin/intro/#requirements).
* For production environments, consider restricting firewall access after installation.
* Use the [DavPanel Install Command Generator](https://davpanel.com/install) for advanced configuration options.

---

**Congratulations!** You have successfully installed DavPanel on Vultr.
