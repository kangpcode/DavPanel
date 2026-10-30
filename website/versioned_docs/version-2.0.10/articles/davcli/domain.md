# Domain 

`davcli domain` command is used to set domain name for accessing the DavPanel and DavAdmin interfaces.

View current setting:
```bash
davcli domain
```

Set domain:

```bash
davcli domain set <DOMAIN_NAME>
```
Example:
```bash
davcli domain set srv7.davpanel.org
```

`--debug` flag can be passed to dispaly verbose information as script is running.

Note: If domain is not pointed to the server via A record and SSL can not be generated, then `http://IP` will be used instead of `https://DOMAIN`.

Set IP address to be used instead of domain:

```bash
davcli domain set ip
```
