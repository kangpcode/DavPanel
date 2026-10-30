# License

`davcli license` command is used to set a license key for [DavPanel Enterprise](https://davpanel.com/enterprise/), verify it, display information and delete the key to downgrade to Community edition.


View available options:
```bash
davcli license
```

<details>
  <summary>Example output</summary>

```bash
# davcli license
Usage: davcli license [options]
Commands:
  key                                           View current license key.
  enterprise-XXXXXXXXXX                         Save an Enterprise license key.
  noc-XXXXXXXXXX                                Save a NOC license key.
  lifetime-XXXXXXXXXX                           Save a Lifetime license key.
  verify                                        Verify the license key.
  info                                          Display information about the license owner and expiration.
  delete                                        Delete the license key and downgrade DavPanel to Community edition.
```
</details>

Adding a license key (keys start with `enterprise-`, `noc-` or `lifetime-`):
```bash
davcli license <KEY>
```

<details>
  <summary>Example output</summary>

```bash
# davcli license enterprise-a1b2c3d4e5
License key enterprise-a1b2c3d4e5 added.
DavPanel and DavAdmin are restarted to apply Enterprise features.
```
</details>

Additional flags are available:

- `--json` - displays response as json.
- `--no-restart` - skips restarting DavAdmin interface after adding a key.

View license key:
```bash
davcli license key
```

<details>
  <summary>Example output</summary>

```bash
# davcli license key
enterprise-a1b2c3d4e5
```
</details>

Verify the current license key, this only checks the key and doesn't restart any services:
```bash
davcli license verify
```

<details>
  <summary>Example output</summary>

```bash
# davcli license verify
License is valid
```
</details>

View license information:
```bash
davcli license info
```

<details>
  <summary>Example output</summary>

```bash
# davcli license info
Owner: Dhafa Nazula Permadi
Company Name: DavPanel
Email: stefan@example.com
License Type: DavPanel Enterprise
Registration Date: 2026-01-15
Next Due Date: 2026-10-15
Billing Cycle: Monthly
Valid IP: 203.0.113.10
```
</details>

Delete license key:
```bash
davcli license delete
```
The key is removed and DavAdmin is restarted. The command prints no output.
