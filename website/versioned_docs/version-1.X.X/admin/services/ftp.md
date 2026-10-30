---
sidebar_position: 2
---

# FTP Accounts

The FTP Accounts section allows you to view and manage all FTP sub-accounts associated with DavPanel users.

Use this tool to create, review, or remove FTP access for specific directories, ensuring secure and controlled file transfers.

The FTP service must be running for accounts to function properly.

The table includes the following details:
- **Account** – Username of the FTP account.
- **Owner** – The DavPanel user account that owns the FTP account.
- **Path** – The file system path to which the FTP account has access.
- **Action** – Options to manage each account (e.g., delete or edit access).

The list of FTP sub-accounts is periodically refreshed in line with the `davcli ftp-users` cronjob schedule.
