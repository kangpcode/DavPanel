# Domain 

`davcli domain` command is used to set domain name for accessing the DavPanel and DavAdmin interfaces.

View current setting:
```bash
davcli domain
```

<details>
  <summary>Example output</summary>

```bash
# davcli domain
srv7.davpanel.org
```
</details>

Set domain:

```bash
davcli domain set <DOMAIN_NAME>
```

<details>
  <summary>Example output</summary>

```bash
# davcli domain set srv7.davpanel.org
srv7.davpanel.org is now set for accessing the DavPanel and DavAdmin interfaces.
```
</details>

Additional flags:

- `--debug` - display verbose information as the script is running.
- `--no-restart` - skip restarting services after the change.

Note: If domain is not pointed to the server via A record and SSL can not be generated, then `http://IP` will be used instead of `https://DOMAIN`.

Set IP address to be used instead of domain:

```bash
davcli domain ip
```

<details>
  <summary>Example output</summary>

```bash
# davcli domain ip
203.0.113.10 is now set for accessing the DavPanel and DavAdmin interfaces.
```
</details>

