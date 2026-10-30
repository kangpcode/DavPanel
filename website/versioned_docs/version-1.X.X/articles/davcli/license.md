# License

`davcli license` command is used to set a license key for [DavPanel Enterprise](https://davpanel.com/enterprise/), verify it, display information and delete the key to downgrade to Community edition.


View available options:
```bash
davcli license
```

Adding a license key:
```bash
davcli license <KEY>
```

Additional flags are available:

- `--json` - displays response as json.
- `--no-restart` - skips restarting DavAdmin interface after adding a key.

View license key:
```bash
davcli license key
```

View license information:
```bash
davcli license info
```
Delete license key:
```bash
davcli license delete
```
