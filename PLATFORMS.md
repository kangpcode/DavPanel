# DavPanel platform support

Updated: 2026-11-01.

DavPanel's hosting runtime needs Linux, systemd, cgroups, kernel namespaces,
rootless Podman, Python 3.9+ and filesystem quotas. A browser or a development environment
does not provide all of those host capabilities.

## Hosting OS versions

These are the current release targets for the implemented installer branches.
The installer detects distribution families; detection alone does not establish
compatibility with every release of that family. Both editions use these OS paths.
**No OS/version has a completed clean-server DavPanel acceptance run recorded in
this repository.** Upstream installation results are not DavPanel test results.

| Distribution | Release targets | Available installer path and restrictions |
| --- | --- | --- |
| Ubuntu Server | 22.04, 24.04, 26.04 LTS | APT packages; clean VM installation remains unverified |
| Debian | 12, 13 | APT packages; clean VM installation remains unverified |
| AlmaLinux | 9.x, 10.x | DNF packages; use the latest minor release; quotas and the complete hosting stack need acceptance testing |
| Rocky Linux | 9.x, 10.x | DNF packages; `configure_rocky` currently requires `--skip-firewall` on both major versions; configure and validate a separate firewall |
| Oracle Linux | 10.x | DNF and EPEL 10 packages; the current installer hardcodes EPEL 10, so Oracle Linux 9 is not an installation target |
| CentOS Stream | 9, 10 | RPM packages through the yum/DNF compatibility path; clean VM installation remains unverified |
| Fedora | Maintained releases | Experimental DNF branch; no release has been certified |
| openEuler | Maintained releases | Experimental DNF branch; no release has been certified |

Use current minor releases and security updates. Debian 10/11 and CentOS Linux
7/8 are not targets for new installations. Other releases and distributions,
including AlmaLinux/Rocky Linux 8, need their own compatibility work before being
added to this list.

Release names and lifecycle references: [Ubuntu](https://ubuntu.com/about/release-cycle),
[Debian](https://www.debian.org/releases/),
[AlmaLinux](https://wiki.almalinux.org/release-notes/),
[Rocky Linux](https://docs.rockylinux.org/latest/releases/),
[Oracle Linux installation media](https://yum.oracle.com/oracle-linux-isos.html),
and [CentOS Stream](https://www.centos.org/download/).
These sources establish distribution releases, rather than DavPanel compatibility.

## Architectures and development environments

| Environment | Available path | Verification status |
| --- | --- | --- |
| Linux amd64 (x86_64) | Native Go binaries, release builds and installer | Source/binary checks and local container smoke tests passed; clean-server hosting installation remains unverified |
| Linux arm64 (AArch64) | Cross-compiled Go binaries and release workflow | Archive architecture/source/binary checks passed; native hosting installation remains unverified |
| GitHub Codespaces | Dev container: source checks, Go tests/audit/build, documentation preview | Hosting installation is rejected before dependencies or source downloads; clone the complete source before running `bash scripts/dev.sh build` |
| Windows / macOS workstation | Dev container or full Linux VM; browser/SSH client | Native hosting installer unavailable |
| Docker / Podman / LXC / OpenVZ container | Development/build use | Hosting installation is unsupported; use a full Linux VM/VPS or bare metal server |
| WSL2 | Development/client use | Full hosting deployment remains unverified; use a Linux VM for system-level integration |
| Alpine, Arch, SUSE, BSD, 32-bit CPUs | Browser/SSH client or supported Linux VM | Native installer not implemented |

## Acceptance testing

This table describes actual implementation boundaries. It does not claim every
Linux version or every OS is supported. To certify another platform, run a fresh
installation and verify administrator login, tenant provisioning/isolation,
PHP/databases, DNS/TLS, FTP, backup/restore and updates, then record the results.

Recommended starting environment for acceptance: a clean modern Debian/Ubuntu
VM with at least 2 CPU cores, 4 GB RAM and 20 GB free disk. This is a test profile,
not a measured capacity guarantee. Do not install the hosting stack on an existing
development workstation or a server with other hosting control panels.
