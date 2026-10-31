# DavAdmin

DavAdmin is the administrative interface for [**DavPanel**](https://davpanel.com), providing server administrators with a fast, modern, and lightweight dashboard for managing servers, users, services, system settings, and platform configuration.

![davadmin screenshot](https://davpanel.com/img/landing/davadmin-illustration-dark.svg)

Written in **Go**, DavAdmin is designed to be highly efficient with minimal resource consumption while delivering a modern web experience using **Tremor** UI templates. A typical idle installation uses **approximately 15 MB of RAM**, making it suitable for everything from small VPS instances to large production servers.

The template is built using [tremor](https://tremor.so/), [tailwindcss](https://tailwindcss.com/) and [Alpine.js](https://alpinejs.dev/), providing a clean, responsive, and accessible administration experience.

## Features

* Written in Go for high performance and low resource usage
* Typical idle memory usage of approximately **15 MB RAM**
* Server and system administration
* User and account management
* Service management
* System monitoring
* Security configuration
* Plugin and extension support
* REST API integration

## Requirements

DavAdmin has very few requirements:

* Linux operating system
* AMD64 (x86_64) or ARM64 CPU
* DavPanel configuration from the [`davpanel-configuration` repository](https://github.com/kangpcode/davpanel-configuration)

## Installation

DavAdmin is installed as part of the **DavPanel** installation process and is **not intended to be installed separately**.

To install DavPanel (including DavAdmin), run the official installer: https://davpanel.com/install

The installer automatically installs, configures, and registers DavAdmin with the required services and configuration.

## Building from Source

Build for AMD64:

```bash
GOOS=linux GOARCH=amd64 go build -buildvcs=false -o davadmin-amd64 ./cmd/davadmin
```

Build for ARM64:

```bash
GOOS=linux GOARCH=arm64 go build -buildvcs=false -o davadmin-arm64 ./cmd/davadmin
```

## Updating

DavAdmin is updated through the standard DavPanel update process, but can still be independently updated using:

```
davcli update --admin
```

For source builds, pull the latest changes, rebuild the binary, and restart the DavAdmin service:

```
systemctl restart admin
```

## Contributing

Contributions are welcome.

You can contribute by:

* [Reporting bugs](https://github.com/stefanpejcic/OpenPanel/issues/new?template=1_Bug_report.yaml&affected-versions=2.0.0&os=Ubuntu&title=Bug%20in%20OpenAdmin%20UI)
* [Suggesting new features](https://github.com/stefanpejcic/OpenPanel/discussions/new?category=ideas)
* [Improving documentation](https://github.com/kangpcode/DavPanel/tree/main/website/docs/admin)
* [Submitting pull requests](https://github.com/kangpcode/davadmin/pulls)
* [Developing plugins and extensions](https://davpanel.com/docs/articles/dev-experience/custom-plugins/)

Before submitting significant changes, please [open an issue](https://github.com/stefanpejcic/openadmin/issues/new/choose) to discuss your proposal.

By contributing to DavAdmin, you agree that your contributions may be distributed under the project's GPLv3 license.

## Security

If you discover a security vulnerability, please **do not** open a public GitHub issue.

Instead, report it responsibly by contacting: **[info@davpanel.com](mailto:info@davpanel.com)**

## Support

Community support is available through GitHub Issues.

Commercial support, consulting, and enterprise services are available from DavPanel, LLC. on https://my.davpanel.com

## License

DavAdmin is an open-source software licensed under the **GNU General Public License v3.0 or later (GPL-3.0-or-later)**.

Copyright (C) 2026 OpenPanel, LLC.
Original author: Stefan Pejcic

### Plugin Exception

Independent plugins, extensions, themes, and integrations that interact with DavAdmin through its documented APIs and extension mechanisms are **not required to be licensed under GPLv3**.

However, modifications to the DavAdmin core software must be licensed under GPLv3 when distributed.

### Commercial Licensing

Organizations requiring rights beyond those granted by GPLv3—such as proprietary modifications, OEM redistribution, white-label deployments, or other commercial arrangements may obtain a separate commercial license from DavPanel, LLC.

See:

* `LICENSE`
* `COPYING`
* `COMMERCIAL-LICENSE.md`
* `TRADEMARKS.md`

For commercial licensing inquiries:

* Website: https://davpanel.com
* Email: [info@davpanel.com](mailto:info@davpanel.com)
