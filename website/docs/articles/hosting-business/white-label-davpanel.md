---
sidebar_label: "White-Label DavPanel (Checklist)"
description: "Everything you can rebrand in DavPanel for your hosting company: brand name, logo and favicon, panel domain without ports, nameservers, login page, colors and templates, email templates, knowledge base links, webmail and reseller logos."
---

# How to White-Label DavPanel for Your Hosting Company

Your customers should see **your** brand when they log in - not the software you run. DavPanel can be rebranded end to end: from the login URL and logo to the email notifications and help links.

This page is a **checklist** of every branding option, in the order most hosting companies set them up. Each item links to the detailed guide.

---

## 1. Your Own Panel Address

| What | Why | Guide |
|---|---|---|
| **Panel domain** - e.g. `panel.yourhost.com` | Customers log in on your domain, with a valid SSL certificate | [General settings - Domain](/docs/admin/settings/general/#domain) |
| **Separate domain for the user panel** | Keep DavAdmin on one domain and DavPanel on another | [Separate domain for DavPanel](/docs/articles/dev-experience/separate-domain-for-davpanel-access/) |
| **No port in the URL** | `https://panel.yourhost.com` instead of `:2083` | [Remove the port for DavPanel](/docs/articles/dev-experience/remove-custom-port-for-davpanel/) · [for DavAdmin](/docs/articles/dev-experience/remove-custom-port-for-davadmin/) |
| **Webmail domain** - e.g. `webmail.yourhost.com` | Branded webmail address | [Email settings - Webmail](/docs/admin/emails/settings/#webmail) |
| **Custom nameservers** - `ns1.yourhost.com` | Customers point domains to *your* nameservers | [Configure nameservers](/docs/articles/domains/how-to-configure-nameservers-in-davpanel/) |

---

## 2. Brand Name, Logo and Favicon

In **DavAdmin → Settings → DavPanel → Branding**, set:

- **Brand name** - shown in the sidebar and on the login page.
- **Logo image** - your logo instead of the brand name.
- **Favicon** - the browser tab icon.
- **Logout URL** - send customers to your website or client area after logging out.

See [DavPanel settings - Branding](/docs/admin/settings/davpanel/#branding).

**Resellers** can set their own logo for their customers' accounts from their *Reseller Account* page - see [Reseller hosting](/docs/articles/hosting-business/reseller-hosting/).

---

## 3. Look and Feel

| What | Guide |
|---|---|
| **Custom CSS / JS** - colors, fonts, hiding elements, chat widgets | [Custom Code](/docs/admin/settings/custom_code/) |
| **Color scheme** | [Set a custom color scheme](/docs/articles/dev-experience/customizing-davpanel-user-interface/#set-a-custom-color-scheme) |
| **Dashboard links section** - links to your client area, status page, support | [Add a custom section to the dashboard](/docs/articles/dev-experience/add-custom-icons-in-davpanel-dashboard/) |
| **Announcements** for all customers | [Show a custom message](/docs/articles/accounts/how-to-add-custom-message-in-davpanel/) |
| **Onboarding steps** for new customers | [Custom onboarding steps](/docs/articles/dev-experience/add-custom-steps-to-onboarding-wizard/) |

---

## 4. Help and Support Links

- **Knowledge base**: replace the built-in how-to links with articles from your own help center - [Replace How-to articles](/docs/articles/dev-experience/customizing-davpanel-user-interface/#replace-how-to-articles-with-your-knowledge-base).
- **Language**: set the default language and install translations for your market - [Default locale](/docs/articles/accounts/default-user-locales/) · [Locales](/docs/admin/settings/locales/).

---

## 5. Emails Your Customers Receive

- **Sender**: send notifications from your own address and SMTP server - [Notifications settings](/docs/admin/settings/notifications/) and [Fix welcome emails (SMTP)](/docs/articles/support/davpanel-welcome-email-smtp-fix/).
- **Templates**: rewrite the welcome and notification emails with your branding - [Customizing email templates](/docs/articles/dev-experience/customizing-davadmin-email-templates/).

---

## 6. Billing and Client Area

Customers usually start in your billing system, not in the panel. Connect DavPanel to it so accounts are created, suspended and upgraded automatically, and customers log in with one click from the client area:

[WHMCS](/docs/articles/extensions/davpanel-and-whmcs/) · [FOSSBilling](/docs/articles/extensions/davpanel-and-fossbilling/) · [Blesta](/docs/articles/extensions/davpanel-and-blesta/) · [ClientExec](/docs/articles/extensions/davpanel-and-clientexec/) · [WISECP](/docs/articles/extensions/davpanel-and-wisecp/)

---

## 7. Default Content for New Websites

- **Default page** for new domains (the "site coming soon" page) - edit it in **DavAdmin → Domains → Domain Templates**.
- **Suspended page** shown for suspended accounts or domains.
- **WordPress starter plugins and themes** installed with every new site - [Themes and plugins sets](/docs/articles/websites/wordpress-plugins-themes-sets-in-davpanel/).

---

## Keep Your Changes Through Updates

Use the documented override locations (custom code, custom templates, email template overrides) instead of editing files inside the containers, so updates don't overwrite your branding. The [Custom Code - After Update](/docs/admin/settings/custom_code/#after-update) hook can re-apply anything else automatically.

---

## Related

- [Start a web hosting business with DavPanel](/docs/articles/hosting-business/start-web-hosting-business/)
- [White-label and rebrand the control panel (detailed guide)](/docs/articles/dev-experience/customizing-davpanel-user-interface/)
