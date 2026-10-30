---
sidebar_position: 2
---

# Dashboard

The dashboard page is the hub of the DavAdmin interface and provides the overview of the current server performance and usage.

The dashboard page contains widgets:

- **User Activity** widget: Displays real-time combined activity log of all DavPanel users.
- **Latest News** widget: Displays blog articles from the DavPanel blog.
- **System Information** widget: Displays Information about your server configuration: Hostname, OS, DavPanel version, Kernel, CPU type, Uptime, NUmber of Running Processes and available Package Updates.

## Usage

In the top-right corner of every page in **DavAdmin**, administrators can monitor real-time resource usage, including **Load**, **Memory**, **CPU**, and **Disk**.

Hovering over each metric provides detailed information:

* **Load** – Average system load over 1, 5, and 15 minutes
* **Memory** – Usage of physical memory and SWAP
* **CPU** – Usage per CPU core
* **Disk** – Usage per disk partition

![SSE Widget](/img/docs-content/9Q9DMPH0-davadmin-sse.gif)

## User Activity

The **User Activity** widget provides a combined list of latest actions from all DavPanel users (their activity logs).

## Latest News

The **Latest News** widget displays news from [DavPanel Blog](https://davpanel.com/blog).

## System Information

The **System Information** widget displays information about your server:

- Hostname
- OS
- DavPanel version
- Server Time
- Kernel version
- CPU model
- Uptime
- Number of running processes
- Available Package updates

## Try Enterprise

The **Try Enterprise** widget is displayed on Community Edition only and displays features for Enterprise edition and options to upgrade.

## Found a Bug

By default, every page in both the DavPanel and DavAdmin UIs includes a **"Found a bug? Let us know"** link at the bottom. This link allows users to report issues directly to our [GitHub Issues](https://github.com/stefanpejcic/OpenPanel/issues) page and includes basic information to help reproduce the problem.

For the DavPanel UI, administrators can disable this link by going to **DavAdmin > Settings > DavPanel** and toggling off the **"Display link to report bugs"** option.

## Dark Mode

To enable Dark Mode, click your username in the bottom-left corner and select the Moon icon. To switch back to Light Mode, click the Sun icon.

![davadmin dark mode](/img/admin/dashboard/davadmin_dark_mode_toggle.gif)

## Menu

DavAdmin menu lists all available options in the DavAdmin interface. Simply click on a menu item to open it.

## Search

Search returns:

- DavPanel users with login link for their DavPanel
- Website/Domains of users
- Features/pages in the Admin interface

## Keyboard Shortcuts

DavAdmin UI can be navigated using keyboard shortcuts: [view documentation](/docs/articles/dev-experience/davadmin-keyboard-shortcuts/).

## Logout

To log out of the DavAdmin account, click your username in the bottom-left corner and select 'Sign out' option.
