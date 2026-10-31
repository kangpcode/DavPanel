# CyberPanel 2 DavPanel account import
Free DavPanel module to import CyberPanel backup in DavPanel

## Features

Currently suported for import:
```
├─ DOMAINS:
│  ├─ Primary domain, Addons, Aliases and Subdomains
│  └─ SSL certificates
├─ WEBSITES:
│  └─ WordPress instalations
├─ DATABASES:
│    └─ MySQL databases and users
├─ PHP:
│    └─ PHP versions per domain
├─ FILES
└─ ACCOUNT
    └─ CyberPanel account password

***emails, crons, dns, ftp, nodejs/python, postgres are not yet supported***
```

## Usage

Run the script with sudo privileges:

```
git clone https://github.com/kangpcode/CyberPanel-to-DavPanel.git
```

```
bash CyberPanel-to-DavPanel/cp-import.sh --backup-location=/path/to/cyberpanel_backup.file --plan-name='Standard plan'
```

## Parameters

- `--backup-location=` Path to the CyberPanel backup file
- `--plan-name=`      Name of the hosting plan in DavPanel
- `--dry-run`         extract archive and display data without actually importing account

## Disclaimer

This script is provided as-is, without any guarantees. Always test thoroughly in a non-production environment before using in production.
