# Imunify 

`davcli imunify` command enables administrators to install, start, manage, and uninstall the [ImunifyAV standalone service](https://cloudlinux.zendesk.com/hc/en-us/articles/4716287786396-Imunify360-Standalone-installation-guide-with-integration-conf-examples).

> Note: Imunify, its trademarks, and all related assets are the property of [CloudLinux Zug GmbH](https://cloudlinux.com/).

This command acts as a wrapper that installs and runs the ImunifyAV GUI as a standalone PHP server, following the official setup guide provided here: [Imunify360 Standalone installation guide with integration.conf examples
](https://cloudlinux.zendesk.com/hc/en-us/articles/4716287786396-Imunify360-Standalone-installation-guide-with-integration-conf-examples) 

## Install

To install ImunifyAV:

```bash
davcli imunify install
```

## Status

To check the status of the ImunifyAV GUI:

```bash
davcli imunify status
```

## Start

To start the ImunifyAV GUI:

```bash
davcli imunify start
```

## Stop

To stop the ImunifyAV GUI:

```bash
davcli imunify stop
```

## Update

To update ImunifyAV:

```bash
davcli imunify update
```

## Uninstall

To uninstall ImunifyAV:

```bash
davcli imunify uninstall
```
