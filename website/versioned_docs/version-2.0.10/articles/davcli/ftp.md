# FTP

Enable and manage FTP server shared for all DavPanel users.


## List

List all FTP sub-users from all DavPanel accounts:
```bash
davcli ftp-list
```


List all FTP sub-users for a single DavPanel accounts:
```bash
davcli ftp-list <DAVPANEL_USERNAME>
```

## Add
Create FTP sub-user for davpanel user:
```bash
davcli ftp-add <NEW_USERNAME> <NEW_PASSWORD> <FOLDER> <DAVPANEL_USERNAME>
```

## Password
Change password for FTP sub-user of davpanel user:
```bash
davcli ftp-password <username> <new_password> <davpanel_username> [--debug]
```

## Path
Change FTP path for sub-user:
```bash
davcli ftp-path <action> <username> <path> <davpanel_username> [--debug]
```

## Delete
Delete FTP sub-user for davpanel user:
```bash
davcli ftp-delete <username> <davpanel_username> [--debug]
```

## Connections
View all current connections to the FTP servise:
```bash
davcli ftp-connections
```

View current connections for a specific DavPanel user:
```bash
davcli ftp-connections <davpanel_username>
```

## Logs
View live FTP service logs while service is running:
```
davcli ftp-connections <davpanel_username>
```

## Users
Recreate list of all ftp users:
```bash
davcli ftp-users
```
