# Locale

List or install new locale(s) for DavPanel interface.

List all available locales:
```bash
davcli locale
```

<details>
  <summary>Example output</summary>

```bash
# davcli locale
Please provide at least one locale.

Available locales:
bg-bg
de-de
en-us
es-es
fr-fr
...
sr-rs
tr-tr
uk-ua
zh-cn

Example:
  davcli locale de-de
  davcli locale de-de es-es
```
</details>

Install a single locale:
```bash
davcli locale sr-rs
```

<details>
  <summary>Example output</summary>

```bash
# davcli locale sr-rs
Creating directory for sr-rs...
Downloading locale...

Flushing cache...
DONE
```
</details>

Install multiple locales at once:
```bash
davcli locale sr-rs tr-tr
```

<details>
  <summary>Example output</summary>

```bash
# davcli locale sr-rs tr-tr
Creating directory for sr-rs...
Downloading locale...

Creating directory for tr-tr...
Downloading locale...

Flushing cache...
DONE
```
</details>

Install ALL available locales at once:
```bash
davcli locale $(curl -s "https://api.github.com/repos/stefanpejcic/openpanel-translations/contents" | jq -r '.[] | select(.type=="dir") | .name' | tr '\n' ' ')
```
