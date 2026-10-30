---
sidebar_position: 8
---

# Disable DavAdmin

As an advanced security measure, DavPanel allows you to completely disable the DavAdmin interface and its related admin service.

By enabling this option, access to DavAdmin will be blocked, preventing any further administrative changes through the UI. This is particularly useful for hardened production environments where direct UI access is unnecessary or unwanted.

Navigate to **Security > Disable DavAdmin**, then click **Confirm** to disable DavAdmin, or **Cancel** to return to the dashboard without making changes.

![Disable DavAdmin page with the Cancel and Confirm buttons](/img/davadmin-screenshots/security/disable-admin-page.png#gh-light-mode-only)
![Disable DavAdmin page with the Cancel and Confirm buttons](/img/davadmin-screenshots/security/disable-admin-page_dark.png#gh-dark-mode-only)

Use this feature with caution — re-enabling DavAdmin access will require manual intervention via server-side configuration. To enable access to the DavAdmin: `davcli admin on`
