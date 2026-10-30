# Port 

`davcli port` command is used to change port (`2083`) for accessing DavPanel.

View current port:
```bash
davcli port
```

<details>
  <summary>Example output</summary>

```bash
# davcli port
2083
```
</details>

Set custom port:

```bash
davcli port set <NUMBER>
```
Example:
```bash
davcli port set 5000
```

<details>
  <summary>Example output</summary>

```bash
# davcli port set 5000
5000 is now set for accessing the DavPanel interface.
```
</details>

Set default port `2083`:

```bash
davcli port default
```

<details>
  <summary>Example output</summary>

```bash
# davcli port default
2083 is now set for accessing the DavPanel interface.
```
</details>

Caddy and DavPanel are restarted and the new port is opened in the CSF firewall. Add `--no-restart` to skip both:
```bash
davcli port set <NUMBER> --no-restart
```
