# DavPanel and competitor comparison

Checked: 2026-10-31. Vendor requirements below are documentation claims, not
measurements made on equal hardware. No competitor installation or comparative
performance benchmark has been run in this workspace.

| Product | Main purpose | Documented server platform | Published RAM requirement | Performance measured here |
| --- | --- | --- | --- | --- |
| DavPanel | Container-based multi-user web hosting | Linux with systemd/Podman; see PLATFORMS.md | Installer currently checks 1 GB; use the recommended acceptance profile in PLATFORMS.md | Container startup/login smoke tests; no production workload benchmark |
| cPanel & WHM | Commercial web hosting control panel | Supported AlmaLinux/CloudLinux/Ubuntu releases; see current release-tier matrix | Ubuntu 24.04: 2 GB minimum, 4 GB recommended | Not measured |
| aaPanel | Linux website/server management | Listed Ubuntu, Debian and RPM distributions | 512 MB minimum in Quick Start | Not measured |
| Coolify | Application deployment platform | Linux distributions; amd64/arm64 | 2 GB minimum, 2 CPU cores | Not measured |
| 1Panel v2 | Linux server and application management | Mainstream Debian/RedHat-based Linux, multiple CPU architectures | At least 1 GB available recommended | Not measured |
| CyberPanel | Web hosting with OpenLiteSpeed/LiteSpeed | Listed Ubuntu, AlmaLinux and CloudLinux releases | 1024 MB or higher in installation guide | Not measured |

Sources:

- [cPanel platform matrix](https://support.cpanel.net/hc/en-us/articles/1500001216582-What-operating-systems-are-supported-by-cPanel) and [Ubuntu requirements](https://docs.cpanel.net/installation-guide/system-requirements-ubuntu/).
- [aaPanel Quick Start](https://www.aapanel.com/docs/guide/quickstart.html).
- [Coolify self-hosting requirements](https://coolify.io/docs/start-with-self-hosted).
- [1Panel v2 installation requirements](https://1panel.pro/docs/v2/installation/online_installation/).
- [CyberPanel installation guide](https://cyberpanel.net/KnowledgeBase/home/install-cyberpanel/) and [current support page](https://cyberpanel.net/support). Their listed versions differ; verify the actual release before deployment.

## Reproduce a performance comparison

Use separate clean VMs with identical vCPU/RAM/disk, region, OS where supported,
and database/web/PHP versions. Record each product version, enabled services,
license tier and configuration. Test installation time, full-stack idle RAM/CPU,
storage usage, HTTP latency, sustained concurrent application throughput, and
backup/restore duration with the same site and dataset. Repeat runs and retain
raw samples; test reliability and isolation separately from response speed.

For a small HTTP probe of your own already-installed servers:

```bash
python3 benchmarks/collect.py --targets benchmarks/targets.example.json --output /tmp/davpanel-benchmark --samples 20
```

Add the other product names and their test VM URLs to a private targets file.
The collector saves JSON and Markdown, reports failed probes, and leaves missing
measurements empty. It verifies HTTPS by default; use trusted test certificates.
It measures complete sequential HTTP responses, including redirects and page
bodies. It does not measure server throughput, installation time, tenant capacity
or memory. Do not rank products from unlike endpoints or undocumented settings.

Store public, sanitized benchmark results and methodology in GitHub. Keep private
test URLs, access tokens, customer data and server backups outside the repository.
