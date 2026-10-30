# Locale

List or install new locale(s) for DavPanel interface:

- List all available locales:
  ```bash
  davcli locale
  ```
- Installing single locale:
  ```bash
  davcli locale sr-sr
  ```
- Installing multiple locales at once:
  ```bash
  davcli locale sr-sr tr-tr
  ```
- Installing ALL available locales at once:
  ```bash
  davcli locale $(curl -s "https://api.github.com/repos/stefanpejcic/openpanel-translations/contents" | jq -r '.[] | select(.type=="dir") | .name' | tr '\n' ' ')
  ```
