---
sidebar_label: "DavPanel Installation on Microsoft Azure"
---

# How to Install a Hosting Control Panel on Microsoft Azure

This guide will walk you through deploying **DavPanel** on an Azure Virtual Machine with Ubuntu.

---

## Prerequisites

- An active [Microsoft Azure account](https://portal.azure.com/).
- Basic familiarity with SSH, Azure Virtual Machines, and network/firewall settings.

---

## Step 1: Create a Virtual Machine

1. Log in to the **[Azure Portal](https://portal.azure.com/)**.
2. Navigate to **Virtual Machines → Create → Virtual Machine**.
3. Select an **image**:
   - Ubuntu 24.04
4. Choose a **size** meeting the minimum requirements:
   - **1 CPU, 2 GB RAM** (recommended: `Standard_B1s` or equivalent)
5. Choose **authentication type**:
   - **SSH public key** (recommended)
   - Enter a username and upload or paste your SSH public key
6. Configure networking and firewall settings:
   - Allow all TCP traffic **or** specific ports:
     - `22` (SSH)
     - `80` (HTTP)
     - `443` (HTTPS)
     - `2083` (DavPanel)
     - `2087` (DavAdmin)
     - `443 UDP` (for HTTP/3 support)

---

## Step 2: Connect to Your Virtual Machine

Use SSH to connect:

```bash
ssh -i your_private_key azure@yourIpAddress
```

> Replace `your_private_key` with your private key file and `yourIpAddress` with the public IP of your VM.

The installer must run as **root**, so switch to the root user:

```bash
sudo -i
```

![Terminal showing the first SSH connection as azure and switching to root with sudo -i: confirming the server's host key fingerprint, the Ubuntu 24.04 welcome message, and the root prompt](/img/davpanel-screenshots/install/ssh-microsoft-azure.png#screenshot)

---

## Step 3: Run the DavPanel Installer

Once logged in, run the installer script:

```bash
bash <(curl -sSL https://davpanel.org)
```

The installer runs without any prompts and takes about 5 minutes. When it finishes, it prints the **DavAdmin URL**, **username** and **password**.

![DavPanel installer output in a terminal: the DavPanel banner with version, OS, IP and Podman engine, each installation step marked OK, and the DavAdmin URL with the generated username and password at the end](/img/davpanel-screenshots/install/installer-output-generic.png#screenshot)

---

## Step 4: Access DavPanel

1. Open your browser and navigate to:

```
https://yourIpAddress:2087
```

2. Log in using the credentials created during installation.

---

## Notes

* Ensure your VM meets [DavPanel minimum requirements](https://davpanel.com/docs/admin/intro/#requirements).
* After installation, consider restricting firewall access for better security.
* Use the [DavPanel Install Command Generator](https://davpanel.com/install) for advanced configuration options.

---

**Congratulations!** You have successfully installed DavPanel on Microsoft Azure.
