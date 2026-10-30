---
sidebar_position: 8
---

# Update Preferences


The Update Preferences page in DavPanel allows you to manage and control how updates are applied. It is organized into sections: Current Version, Auto Updates, Update Logs, and Rollback.

## Current Version
This section displays information about the version of DavPanel currently installed on your system, as well as the latest available version.

![Current version section with the installed and latest version and the changelog link](/img/davadmin-screenshots/settings/updates-current.png#gh-light-mode-only)
![Current version section with the installed and latest version and the changelog link](/img/davadmin-screenshots/settings/updates-current_dark.png#gh-dark-mode-only)

- **Installed Version:** Shows the version of DavPanel currently running.

- **Latest Version:** Shows the most recent version available for update.

If the installed version matches the latest version, DavPanel is fully up to date. If not, you can initiate a manual update via a button to upgrade to the latest version.

## Auto Updates
The Auto Updates section lets you configure how DavPanel should handle updates automatically.
You can select the update policy that best fits your needs:

- **Minor Versions Only:** Automatically apply updates that include only bug fixes and security patches. Major feature updates must be installed manually.

- **Both Minor and Major Versions:** Automatically apply all updates, including new features, bug fixes, and security enhancements.

- **Major Versions Only:** Automatically apply updates that introduce major new features. Bug fixes and security patches will require manual updates.

- **Never:** Disable automatic updates. You will need to manually check for and install all updates.

![Auto Updates section with the update preference dropdown](/img/davadmin-screenshots/settings/updates-auto.png#gh-light-mode-only)
![Auto Updates section with the update preference dropdown](/img/davadmin-screenshots/settings/updates-auto_dark.png#gh-dark-mode-only)

Choosing the appropriate auto-update setting ensures that DavPanel remains as stable, secure, and feature-rich as you need it to be.

A recommendation is shown under the dropdown for the two options that skip security patches:

- **Never:** update manually at least once a month.
- **Major Versions Only:** update manually at least once a quarter, to get the minor versions with bug fixes and security patches.

Both link to [how to update manually](/docs/articles/davcli/update/), and also say how many days ago the last update ran when that's over a month (Never) or 90 days (Major Versions Only).

## Update Logs
The Update Logs section provides a record of all updates that have been applied to DavPanel.

![Update Logs section listing the update log files](/img/davadmin-screenshots/settings/updates-logs.png#gh-light-mode-only)
![Update Logs section listing the update log files](/img/davadmin-screenshots/settings/updates-logs_dark.png#gh-dark-mode-only)

## Rollback
The Rollback section lets you revert the DavPanel UI to an earlier version by selecting it from the list of available versions. Be sure to also disable automatic updates when rolling back, otherwise DavPanel may automatically update again.

![Rollback section for returning to a previous version](/img/davadmin-screenshots/settings/updates-rollback.png#gh-light-mode-only)
![Rollback section for returning to a previous version](/img/davadmin-screenshots/settings/updates-rollback_dark.png#gh-dark-mode-only)

## Control Updates
For more information about updates, check:
- [How to Enable Automatic Updates for DavPanel](/docs/articles/install-update/how-to-enable-auto-update-davpanel/)
- [How to Disable Automatic Updates for DavPanel](/docs/articles/install-update/how-to-disable-auto-update-davpanel/)
- [How to Manually Update DavPanel](/docs/articles/install-update/how-to-enable-auto-update-davpanel/)
- [How to Skip a Specific DavPanel Version Update](/docs/articles/install-update/skip-specific-davpanel-version-update)
- [How to Check DavPanel Version from Terminal](/docs/articles/install-update/how-to-check-davpanel-version)
