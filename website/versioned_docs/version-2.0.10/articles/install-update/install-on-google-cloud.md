# DavPanel Installation on Google Cloud

This guide will walk you through deploying **DavPanel** on a Google Cloud VM instance with Ubuntu.

---

## Prerequisites

- An active [Google Cloud account](https://console.cloud.google.com/).
- Basic familiarity with SSH, Compute Engine, and firewall settings.

---

## Step 1: Create a VM Instance

1. Log in to the **Google Cloud Console**.
2. Navigate to **Compute Engine → VM instances → Create Instance**.
3. Choose a **boot disk image**:
   - Ubuntu 24.04
4. Select a **machine type** meeting the minimum requirements:
   - **1 CPU, 2 GB RAM** (recommended: `e2-small` or equivalent)
5. Add a **network tag** (e.g., `DAVPANEL`) for firewall rules.
6. In **Network interfaces**, assign a **static external IP**.
7. Click **Create** to launch the VM.

---

## Step 2: Configure Firewall Rules

1. Navigate to **VPC Network → Firewall rules → Create Firewall Rule**.
2. Configure the rule:
   - **Targets:** Specified target tags → `DAVPANEL`
   - **Source IP ranges:** `0.0.0.0/0`
   - **Protocols and ports:** `tcp:2087` (admin panel port)
3. Save the firewall rule.

> DavPanel manages its own internal firewall; the above rule allows external access to the admin panel.

---

## Step 3: Connect to Your VM

Use SSH to connect:

```bash
ssh username@yourStaticIpAddress
````

> Replace `username` with your VM username (e.g., `ubuntu` or `debian`) and `yourStaticIpAddress` with your static external IP.

---

## Step 4: Run the DavPanel Installer

Once connected, run the installer script:

```bash
bash <(curl -sSL https://davpanel.org)
```

> Follow the prompts to select your preferred database engine and complete installation.

---

## Step 5: Access DavPanel

1. Open your browser and navigate to:

```
https://yourStaticIpAddress:2087
```

2. Log in using the credentials created during installation.

---

## Notes

* Ensure your VM meets [DavPanel minimum requirements](https://davpanel.com/docs/admin/intro/#requirements).
* After installation, consider restricting firewall access for better security.
* Use the [DavPanel Install Command Generator](https://davpanel.com/install) for advanced configuration options.

---

**Congratulations!** You have successfully installed DavPanel on Google Cloud.
