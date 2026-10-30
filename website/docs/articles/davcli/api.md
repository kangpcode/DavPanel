# API

:::info
API access is available only on [DavPanel Enterprise edition](https://davpanel.com/beta/)
:::

## Enable

To enable DavAdmin API access:

```bash
davcli api on
```

<details>
  <summary>Example output</summary>

```bash
# davcli api on
Updated api to on
```
</details>

## Disable

To disable DavAdmin API access:

```bash
davcli api off
```

<details>
  <summary>Example output</summary>

```bash
# davcli api off
Updated api to off
```
</details>

## Status

To check current DavAdmin API status:

```bash
davcli api status
```

<details>
  <summary>Example output</summary>

```bash
# davcli api status
on
```
</details>

## API list

`davcli api list` displays all API endpoints of the installed DavAdmin version, with the access they need and a curl example for each. The list is built into the DavAdmin binary from the same source as the API docs on **DavAdmin > Settings > API**, and the examples use the DavAdmin URL from `davcli admin`.

```bash
davcli api list
```

<details>
  <summary>Example output</summary>

```bash
# davcli api list
# Authentication

Endpoint: GET /api/
Description: Health check - confirms the API is reachable.
Access: No authentication.
Example:
  curl -X GET 'https://server.example.com:2087/api/'

--------------------------------------------------------------------------------

Endpoint: POST /api/
Description: Log in with username/password and obtain a JWT Bearer token, valid for 15 minutes.
Access: No authentication.
Example:
  curl -X POST 'https://server.example.com:2087/api/' -H "Content-Type: application/json" -d '{"username":"admin","password":"secret"}'

--------------------------------------------------------------------------------

Endpoint: GET /api/whoami
Description: Returns the username embedded in the caller's JWT access token. Reads the identity directly from the token claims rather than the database, so it still answers even if the user row backing the token has since been deleted.
Access: Any authenticated user.
Example:
  curl -X GET 'https://server.example.com:2087/api/whoami' -H "Authorization: Bearer TOKEN_HERE"

--------------------------------------------------------------------------------
...
```
</details>
