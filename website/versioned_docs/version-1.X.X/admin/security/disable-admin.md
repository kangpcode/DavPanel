---
sidebar_position: 7
---

# Disable DavAdmin

As an advanced security measure, DavPanel allows you to completely disable the DavAdmin interface and its related admin service.

By enabling this option, access to DavAdmin will be blocked, preventing any further administrative changes through the UI. This is particularly useful for hardened production environments where direct UI access is unnecessary or unwanted.

Use this feature with caution — re-enabling DavAdmin access will require manual intervention via server-side configuration. To enable access to the DavAdmin: `davcli admin on`
