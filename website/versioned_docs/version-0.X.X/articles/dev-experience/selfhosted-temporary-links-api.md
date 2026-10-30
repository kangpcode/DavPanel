# Self-hosted Temporary Links API for DavPanel SiteManager

[DavPanel SiteManager](/docs/panel/applications/) has a temporary-links option that allows user to test website from the server IP, prior to changing DNS. Proxy domains are subdomains on our hosted api `.davpanel.org`.

## Use Self-hosted Remote API

If you have multiple DavPanel servers and want to use your own domain for temporary links, you can designate one server to host the api, and set DavPanel servers to use that API instead.

To do this, set up the [Temporary Links service for DavPanel server](https://github.com/stefanpejcic/OpenPanel/blob/main/services/proxy/README.md) on one server, add the domain to it, and then update the [temporary_links](https://dev.davpanel.com/cli/config.html#temporary-links) service on your DavPanel servers to use the new instance:

```
davcli config update temporary_links "https://preview.davpanel.org/index.php"
```
