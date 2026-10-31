# DavPanel platform support

DavPanel's hosting runtime needs Linux, systemd, cgroups, kernel namespaces,
rootless Podman, Python 3.9+ and filesystem quotas. A browser or a development environment
does not provide all of those host capabilities.

| Environment | Available path | Verification status |
| --- | --- | --- |
| Debian / Ubuntu server, amd64 | Native installer | Package-manager paths implemented; clean VPS installation remains to be tested |
| AlmaLinux / Rocky / Oracle / CentOS server, amd64 | Native RPM installer paths | Implemented; each OS/version needs its own acceptance run; obsolete releases are unsuitable |
| Fedora / openEuler | Existing RPM installer branches | Experimental, no full installation certification |
| Linux arm64 | Cross-compiled Go binaries and release workflow | Full hosting stack and native installation remain unverified |
| GitHub Codespaces | Dev container: source checks, Go tests/audit/build, documentation preview | Configuration supplied; a hosted Codespace has not been provisioned in this workspace |
| Windows / macOS workstation | Dev container or full Linux VM; browser/SSH client | Native hosting installer unavailable |
| WSL2 / ordinary Docker container | Development/client use | Full hosting deployment is not certified; use a Linux VM for system-level integration |
| Alpine, Arch, SUSE, BSD, 32-bit CPUs | Browser/SSH client or supported Linux VM | Native installer not implemented |

This table describes actual implementation boundaries. It does not claim every
Linux version or every OS is supported. To certify another platform, run a fresh
installation and verify administrator login, tenant provisioning/isolation,
PHP/databases, DNS/TLS, FTP, backup/restore and updates, then record the results.

Recommended starting environment for acceptance: a clean modern Debian/Ubuntu
VM with at least 2 CPU cores, 4 GB RAM and 20 GB free disk. This is a test profile,
not a measured capacity guarantee. Do not install the hosting stack on an existing
development workstation or a server with other hosting control panels.
