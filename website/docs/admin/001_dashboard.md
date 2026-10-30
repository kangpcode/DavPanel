---
sidebar_position: 2
---

# Dashboard

The dashboard page is the hub of the DavAdmin interface and provides the overview of the current server performance and usage.

For administrator accounts, the dashboard also displays a quick summary bar with counts for **Nodes**, **Containers**, **Users**, **Domains**, **Websites**, **Packages**, and **Emails** (each showing current usage against the license's limit, if any). Reseller accounts instead see their own **DavPanel Accounts** and **Disk Space Used** usage against the limits set by the administrator.

![Summary bar with the number of nodes, containers, users, domains, websites, packages and emails](/img/davadmin-screenshots/001_dashboard-summary.png#gh-light-mode-only)
![Summary bar with the number of nodes, containers, users, domains, websites, packages and emails](/img/davadmin-screenshots/001_dashboard-summary_dark.png#gh-dark-mode-only)

Below the welcome message, quick action buttons open the most common tasks: **Create User**, **Add Domain**, **New Plan** and **Check for Updates** (resellers see **Create User** and **New Plan**).

The dashboard page contains widgets:

- **Daily Summary** widget: Displays yesterday's traffic and issues for all accounts combined. Shown only when the [Daily Summary module](/docs/admin/settings/modules/#daily-summary) is enabled.
- **User Activity** widget: Displays real-time combined activity log of all DavPanel users.
- **Latest News** widget: Displays blog articles from the DavPanel blog.
- **System Information** widget: Displays Information about your server configuration: Hostname, IPv4 address, OS, DavPanel version, Server Time, Kernel, CPU type, Uptime, Number of Running Processes and available Package Updates.
- **Resource Usage** widget: Displays a CPU % and RAM % chart for the last hour, with a link to view the full resource usage history.

![DavAdmin dashboard with the summary bar and the User Activity, Latest News, System Information and Resource Usage widgets](/img/davadmin-screenshots/001_dashboard-window.png#gh-light-mode-only)
![DavAdmin dashboard with the summary bar and the User Activity, Latest News, System Information and Resource Usage widgets](/img/davadmin-screenshots/001_dashboard-window_dark.png#gh-dark-mode-only)

## Usage

In the top-right corner of every page in **DavAdmin**, administrators can monitor real-time resource usage, including **Load**, **Memory**, **CPU**, and **Disk**.

Hovering over each metric provides detailed information:

* **Load** – Average system load over 1, 5, and 15 minutes
* **Memory** – Usage of physical memory and SWAP
* **CPU** – Usage per CPU core
* **Disk** – Usage per disk partition

![Resource usage bar in the top-right corner of DavAdmin with the load tooltip open](/img/davadmin-screenshots/001_dashboard-sse.png#gh-light-mode-only)
![Resource usage bar in the top-right corner of DavAdmin with the load tooltip open](/img/davadmin-screenshots/001_dashboard-sse_dark.png#gh-dark-mode-only)

## Daily Summary

The **Daily Summary** widget adds up the [daily summaries](/docs/panel/statistics/daily_summary/) of all DavPanel accounts for the most recent day that has them (up to 7 days back). Resellers see only their own accounts.

It shows:

- **Requests** (with the change from the day before), **Visitors**, **Data sent**, **Server errors** and **WAF blocks**
- **Needs attention**: issues found on user accounts, each with a link to the user
- **Busiest websites**: the top 5 websites by number of requests

The widget is shown only when:

- the **`summary`** module is enabled on [**Settings > Modules**](/docs/admin/settings/modules/#daily-summary), and
- at least one user has the **summary** feature in their [feature set](/docs/admin/plans/feature-manager/) and already has a saved summary (they are saved each day at 06:15 for the previous day).

## User Activity

The **User Activity** widget provides a combined list of latest actions from all DavPanel users (their activity logs).

![User Activity widget with the latest actions of all DavPanel users](/img/davadmin-screenshots/001_dashboard-activity.png#gh-light-mode-only)
![User Activity widget with the latest actions of all DavPanel users](/img/davadmin-screenshots/001_dashboard-activity_dark.png#gh-dark-mode-only)

## Latest News

The **Latest News** widget displays news from [DavPanel Blog](https://davpanel.com/blog).

![Latest News widget with articles from the DavPanel blog](/img/davadmin-screenshots/001_dashboard-news.png#gh-light-mode-only)
![Latest News widget with articles from the DavPanel blog](/img/davadmin-screenshots/001_dashboard-news_dark.png#gh-dark-mode-only)

## System Information

The **System Information** widget displays information about your server:

- Hostname
- IPv4 address
- OS
- DavPanel version
- Server Time
- Kernel version
- CPU model
- Uptime
- Number of running processes
- Available Package updates

![System Information widget with hostname, IPv4 address, OS, DavPanel version, server time, kernel, CPU, uptime, processes and package updates](/img/davadmin-screenshots/001_dashboard-sysinfo.png#gh-light-mode-only)
![System Information widget with hostname, IPv4 address, OS, DavPanel version, server time, kernel, CPU, uptime, processes and package updates](/img/davadmin-screenshots/001_dashboard-sysinfo_dark.png#gh-dark-mode-only)

## Resource Usage

The **Resource Usage** widget displays a chart of CPU % and RAM % usage over the last hour. Click **View history** to open the full Resource Usage history page (**Server > Resource Usage**).

![Resource Usage widget with a chart of CPU and RAM usage over the last hour and the View history link](/img/davadmin-screenshots/001_dashboard-usage.png#gh-light-mode-only)
![Resource Usage widget with a chart of CPU and RAM usage over the last hour and the View history link](/img/davadmin-screenshots/001_dashboard-usage_dark.png#gh-dark-mode-only)

## Tasks

The **Tasks** widget lists background tasks that are currently running on the server. Click **View all** to open the full list of tasks, where you can tick running tasks and **Kill** them all at once from the bulk actions bar.

![Tasks widget with the currently running background tasks and the View all link](/img/davadmin-screenshots/001_dashboard-tasks.png#gh-light-mode-only)
![Tasks widget with the currently running background tasks and the View all link](/img/davadmin-screenshots/001_dashboard-tasks_dark.png#gh-dark-mode-only)

## Found a Bug

By default, every page in both the DavPanel and DavAdmin UIs includes a **"Found a bug? Let us know"** link at the bottom. This link allows users to report issues directly to our [GitHub Issues](https://github.com/stefanpejcic/OpenPanel/issues) page and includes basic information to help reproduce the problem.

For the DavPanel UI, administrators can disable this link by going to **Settings > DavPanel** and toggling off the **"Display link to report bugs"** option.

## Dark Mode

To enable Dark Mode, click your username in the bottom-left corner and select the Moon icon. To switch back to Light Mode, click the Sun icon.

![DavAdmin dashboard in dark mode](/img/davadmin-screenshots/001_dashboard_dark-window.png#screenshot)

## Menu

DavAdmin menu lists all available options in the DavAdmin interface. Simply click on a menu item to open it.

The menu comes in two styles, set by the **Menu Style** option on [**Settings > DavPanel**](/docs/admin/settings/davpanel/#display) (the same option sets the default for DavPanel users):

- **Classic** (default): items are grouped in expandable sections, like the screenshot below.
- **Modern**: the sidebar has one link per area - Accounts, Hosting Plans, Domains, Emails, Backups, then **Server** (Services, Security, Server, System) and **Settings** (Settings, License & Support) - and the pages of that area are shown as tabs at the top of each page.

These docs use the Modern names, so a path like **System > Server Time** means: click **System** in the sidebar, then the **Server Time** tab. In the Classic menu the same pages are in the expandable groups, for example **Server > Server Time**.

In the Modern menu, a colored dot next to a sidebar item flags something that needs attention - hover it to see what:

- **Services** (red): a monitored service is down, according to an unread notification.
- **Settings** (orange): changes are waiting for an DavPanel or DavAdmin restart.

Settings pages (General, DavPanel, User Defaults, PHP, Notifications, Updates, Custom Code and Service Limits) ask for confirmation before you leave with changes that weren't saved.

![DavAdmin sidebar menu with the Accounts, Hosting Plans, Domains, Emails, Services, Security, Settings and Advanced sections](/img/davadmin-screenshots/001_dashboard-menu.png#gh-light-mode-only)
![DavAdmin sidebar menu with the Accounts, Hosting Plans, Domains, Emails, Services, Security, Settings and Advanced sections](/img/davadmin-screenshots/001_dashboard-menu_dark.png#gh-dark-mode-only)

## Search

Search returns:

- DavPanel users with login link for their DavPanel
- Website/Domains of users
- Features/pages in the Admin interface, shown as **Area › Page** - pages can be found by their current name, their previous name (for example **General Settings** or **CorazaWAF**) or the menu area they are in

![Search box in the DavAdmin sidebar with matching pages, users and websites](/img/davadmin-screenshots/001_dashboard-search.png#gh-light-mode-only)
![Search box in the DavAdmin sidebar with matching pages, users and websites](/img/davadmin-screenshots/001_dashboard-search_dark.png#gh-dark-mode-only)

## Keyboard Shortcuts

DavAdmin UI can be navigated using keyboard shortcuts: [view documentation](/docs/articles/dev-experience/davadmin-keyboard-shortcuts/).

Press **Ctrl + K** (or **Cmd + K** on macOS) on any page to show the list of available shortcuts:

![Keyboard shortcuts dialog opened with Ctrl + K, listing the key combinations for DavAdmin pages](/img/davadmin-screenshots/001_dashboard-shortcuts.png#gh-light-mode-only)
![Keyboard shortcuts dialog opened with Ctrl + K, listing the key combinations for DavAdmin pages](/img/davadmin-screenshots/001_dashboard-shortcuts_dark.png#gh-dark-mode-only)

## Logout

To log out of the DavAdmin account, click your username in the bottom-left corner and select 'Sign out' option.
