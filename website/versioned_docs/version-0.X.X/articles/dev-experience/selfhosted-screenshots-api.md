# Self-hosted Screenshots API for DavPanel SiteManager

[DavPanel SiteManager](/docs/panel/applications/) displays a website screenshot for each website. These screenshots are generated using our hosted API.

## Use Self-hosted Local Service

When installing DavPanel on your server, you can use the `--screenshots=local` flag to generate and host screenshots locally on your server instead.

This method is recommended for shared servers with a few TBs of storage and hundreds of websites.

DavPanel will then install [Playwright](https://playwright.dev/) on your server to generate screenshots for all websites locally. Note that Playwright requires 1GB of disk space for the service, so it is not recommended for VPS servers.

## Use Third-Party Screenshot APIs

To use a third-party screenshot API, simply update the screenshots URL with the following command:

```
davcli config update screenshots "http://screenshots-api.davpanel.com/screenshot"
```

Replace `http://screenshots-api.davpanel.com/screenshot` with the URL of the third-party service, which will accept `/<DOMAIN>` and return an image.

## Use Self-hosted Remote API

If you have multiple DavPanel servers and want to use your own screenshots API, you can designate one server to generate all the screenshots for domains hosted on other servers.

To do this, set up the [Screenshots API service for DavPanel](https://github.com/stefanpejcic/OpenPanel/blob/main/services/screenshots/README.md) on one server, add the domain to it, and then update the [screenshots](https://dev.davpanel.com/cli/config.html#screenshots) service on your DavPanel servers to use the new instance:

```
davcli config update screenshots "http://your-screenshots-api.com:5000/screenshot"
```
