---
sidebar_position: 6
---

# Custom Code

The Custom Code section, accessible via DavAdmin > Settings > Custom Code, allows you to inject and manage custom code that extends or modifies the behavior and appearance of the DavPanel UI.

## Custom CSS
Inject your own CSS styles that will be applied across all pages of the DavPanel UI. 

Stored in `/etc/davpanel/davpanel/custom_code/custom.css` file.

## Custom JS
Add custom JavaScript to all pages. This is ideal for extending UI functionality, adding widgets, or integrating third-party tools.

Stored in `/etc/davpanel/davpanel/custom_code/custom.js` file.

## Code in Header
Insert custom code directly into the head tag of every page. Useful for meta tags, analytics scripts, and global settings.

Stored in `/etc/davpanel/davpanel/custom_code/in_header.html` file.

## Code in Footer
Insert custom code directly into the footer section of all pages. This is commonly used for tracking scripts, analytics, or deferred JavaScript.

Stored in `/etc/davpanel/davpanel/custom_code/in_footer.html` file.

## How-to Articles
Edit Knowledge Base articles displayed in *DavPanel > Dashboard* page.

Default:
```json
{
    "how_to_topics": [
        {"title": "How to install WordPress", "link": "https://davpanel.com/docs/panel/applications/wordpress#install-wordpress"},
        {"title": "How to enable REDIS Caching", "link": "https://davpanel.com/docs/panel/caching/Redis/#connect-to-redis"},
        {"title": "How to create DNS records", "link": "https://davpanel.com/docs/panel/domains/dns/#create-record"},
        {"title": "How to create a new MySQL database", "link": "https://davpanel.com/docs/panel/databases/#create-a-mysql-database"},
        {"title": "How to add a Cron Job", "link": "https://davpanel.com/docs/panel/advanced/cronjobs#add-a-cronjob"},
        {"title": "How to add a custom SSL Certificate", "link": "https://davpanel.com/docs/panel/domains/ssl/#custom-ssl"}
    ],
    "knowledge_base_link": "https://davpanel.com/docs/panel/intro/?source=davpanel_server"
}
```

## Custom Section

You can add a **custom section** with icon-based items to the *Dashboard* in **DavPanel**.

custom section supports the following fields:

* **`section_title`** *(string)*:
  The title displayed at the top of your custom section.

* **`section_position`** *(string)*:
  Determines where your section appears relative to other built-in sections.
  Acceptable values:

  * `before_files`
  * `before_domains`
  * `before_mysql`
  * `before_postgresql`
  * `before_applications`
  * `before_emails`
  * `before_cache`
  * `before_php`
  * `before_docker`
  * `before_advanced`
  * `before_account`

* **`items`** *(array of objects)*:
  A list of clickable items shown as cards with icons. Each item has:

  * **`label`** *(string)* – The text shown on the card.
  * **`icon`** *(string)* – The icon class from [Bootstrap Icons](https://icons.getbootstrap.com/). Example: `bi bi-person-fill-gear`.
  * **`url`** *(string)* – The link to navigate to when the item is clicked.

Example:
```json
{
  "section_title": "Billing Account",
  "section_position": "before_domains",
  "items": [
    {
      "label": "Manage Profile",
      "icon": "bi bi-person-fill-gear",
      "url": "https://panel.hostio.rs/clientarea.php?action=details"
    },
    {
      "label": "Manage Billing Information",
      "icon": "bi bi-credit-card",
      "url": "https://panel.unlimited.rs/clientarea.php?action=details"
    },
    {
      "label": "View Email History",
      "icon": "bi bi-envelope-open",
      "url": "https://panel.unlimited.rs/clientarea.php?action=emails"
    },
    {
      "label": "News & Announcements",
      "icon": "bi bi-megaphone-fill",
      "url": "https://panel.unlimited.rs/index.php?rp=/announcements"
    },
    {
      "label": "Knowledgebase",
      "icon": "bi bi-book-half",
      "url": "https://panel.unlimited.rs/index.php?rp=/knowledgebase"
    },
    {
      "label": "Server Status",
      "icon": "bi bi-hdd-network",
      "url": "https://panel.unlimited.rs/serverstatus.php"
    },
    {
      "label": "Invoices",
      "icon": "bi bi-receipt",
      "url": "https://panel.unlimited.rs/clientarea.php?action=invoices"
    },
    {
      "label": "Support Tickets",
      "icon": "bi bi-life-preserver",
      "url": "https://panel.unlimited.rs/supporttickets.php"
    },
    {
      "label": "Open Ticket",
      "icon": "bi bi-journal-plus",
      "url": "https://panel.unlimited.rs/submitticket.php"
    },
    {
      "label": "Register New Domain",
      "icon": "bi bi-globe",
      "url": "https://panel.unlimited.rs/cart.php?a=add&domain=register"
    },
    {
      "label": "Transfer Domain",
      "icon": "bi bi-arrow-repeat",
      "url": "https://panel.unlimited.rs/cart.php?a=add&domain=transfer"
    }
  ]
}

```

## PageSpeed API Key

If set, this API key will be used to fetch data from Google PageSpeed Insights.
---

## WordPress Plugins Set

List the WordPress plugins you want to automatically install on all new WordPress sites.
Enter one item per row. Supported formats:

* **wp\_org\_slug** — the plugin slug from the WordPress.org plugin page
* **URL** — a direct link to a `.zip` plugin file hosted online

## WordPress Themes Set

List the WordPress themes to automatically install for all new WordPress sites.
Enter one item per row. Supported formats:

* **wp\_org\_slug** — the theme slug from the WordPress.org themes page
* **URL** — a direct link to a `.zip` theme file hosted online

## Forbidden Usernames

List of usernames that can not be used.

## Restricted Domains

Administrators can restrict the usage of specific domains by adding one domain per line.

Example:

```bash
facebook.com
davpanel.com
pejcic.rs
davpanel.org
demo.davpanel.org
```

Stored in `/etc/davpanel/davpanel/conf/domain_restriction.txt` file.

## After Update
Define custom bash commands that will automatically run after each DavPanel update. Ideal for restoring customizations or triggering automation scripts.

![davadmin custom code](/img/admin/custom_code.png)

This powerful customization layer helps ensure DavPanel fits seamlessly into your environment.

Examples:

- [Custom email templates](https://community.davpanel.org/d/214-customizing-davpanel-email-templates)
- [Custom DavAdmin color scheme](https://community.davpanel.org/d/216-customizing-davadmin-color-scheme)


Stored in `/root/davpanel_run_after_update` file.

## Before Startup

Add custom bash code to be executed before starting DavPanel.

Stored in `/root/davpanel_run_on_startup` file.


