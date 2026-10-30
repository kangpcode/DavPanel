# Imunify 

`davcli imunify` command enables administrators to install, start, manage, and uninstall the [ImunifyAV standalone service](https://cloudlinux.zendesk.com/hc/en-us/articles/4716287786396-Imunify360-Standalone-installation-guide-with-integration-conf-examples).

> Note: Imunify, its trademarks, and all related assets are the property of [CloudLinux Zug GmbH](https://cloudlinux.com/).

This command acts as a wrapper that installs and runs the ImunifyAV GUI as a standalone PHP server, following the official setup guide provided here: [Imunify360 Standalone installation guide with integration.conf examples
](https://cloudlinux.zendesk.com/hc/en-us/articles/4716287786396-Imunify360-Standalone-installation-guide-with-integration-conf-examples) 

## Install

To install ImunifyAV:

```bash
davcli imunify install
```

<details>
  <summary>Example output</summary>

```bash
# davcli imunify install
Installing ImunifyAV...
Creating directories...
Creating pam_deny.so file...
Creating integration.conf file...
Downloading deploy script...
Running deploy script...
...
Configuring ImunifyAV notifications to use 'DavAdmin > Settings > Notifications'...
Setting 2CPU and 1GB Memory limits for ImunifyAV service..
Adding Containers, Images and writable filesystems to ignored files list..
Allowing users to initiate a scan..
Installing PHP if not present...
PHP already installed.
New service added successfully.
Install completed!
```
</details>

## Status

To check the status of the ImunifyAV GUI:

```bash
davcli imunify status
```

<details>
  <summary>Example output</summary>

```bash
# davcli imunify status
Imunify GUI is running.
48213 php -S 127.0.0.1:9000 -t /etc/sysconfig/imunify360/
```
</details>

## Start

To start the ImunifyAV GUI:

```bash
davcli imunify start
```

<details>
  <summary>Example output</summary>

```bash
# davcli imunify start
Starting ImunifyAV...
ImunifyAV GUI started.
```
</details>

## Stop

To stop the ImunifyAV GUI:

```bash
davcli imunify stop
```

<details>
  <summary>Example output</summary>

```bash
# davcli imunify stop
Stopping ImunifyAV...
ImunifyAV GUI disabled.
```
</details>

## Update

To update ImunifyAV:

```bash
davcli imunify update
```

<details>
  <summary>Example output</summary>

```bash
# davcli imunify update
Updating ImunifyAV...
...
Reading package lists... Done
imunify-antivirus is already the newest version.
```
</details>

## Uninstall

To uninstall ImunifyAV:

```bash
davcli imunify uninstall
```

<details>
  <summary>Example output</summary>

```bash
# davcli imunify uninstall
Uninstalling ImunifyAV...
ImunifyAV GUI disabled.
Removing files and directories...
Checking for _imunify user...
User '_imunify' exists. Not removing automatically to avoid breaking dependencies.
→ If you're sure, run: userdel _imunify
Removing ImunifyAV from DavAdmin > Services Status...
Service 'ImunifyAV' removed successfully.
Uninstall complete.
```
</details>

## Scan notifications

After ImunifyAV is installed, every malware scan it starts and finishes is reported by `davcli imunify notify`, which runs on its own when ImunifyAV writes a scan event. Each scan is one notification in DavAdmin, sent by email and webhook when it finishes, with the number of files checked and up to 5 malicious files. To turn these off, disable **ImunifyAV scan started/finished** under User Actions in **DavAdmin > Settings > Notifications**.

When a finished scan of a user's home folder found malware, that user also gets a **Malware found** email listing up to 20 infected files, if they have [Malware found](/docs/panel/account/notifications/#malware-found) turned on.

<details>
  <summary>Example output</summary>

```bash
# davcli imunify notify
stefan notified by email about 2 malicious file(s).
```
</details>
