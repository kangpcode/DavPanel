# Develop DavPanel in Codespaces or a local dev container

Developer: Dhafa Nazula Permadi (kangpcode).

Open this GitHub repository using **Code → Codespaces → Create codespace**, or
use VS Code's **Reopen in Container** on Linux, Windows or macOS. The checked-in
dev container installs Go 1.27.3, Node 24, Python and a separate Docker daemon.
Its startup command checks source integrity and installer regression tests.

```bash
bash scripts/dev.sh check
bash scripts/dev.sh test
bash scripts/dev.sh audit
bash scripts/dev.sh build
bash scripts/dev.sh website
```

The last command serves the documentation on forwarded port 3000. The build
command creates real Linux installation artifacts; `dist/` is ignored by Git.
No hosting credentials, generated binaries or tenant data should be committed.

After reviewing intentional vendored source changes, regenerate the inventory
with `python3 scripts/audit_sources.py --refresh-lock` and commit it together
with every changed or added component file. The audit rejects source files that
Git ignores because those files would be missing from a fresh checkout.

Codespaces runs inside a Linux container. It is a development/build environment,
with no guarantee of host systemd, quota delegation, public DNS/SMTP or the
rootless tenant boundaries required by a hosting installation. The production
installer deliberately rejects a container environment. Run full provisioning
and acceptance tests on a clean Linux VM/VPS reached over SSH. Store SSH keys in
Codespaces secrets rather than repository files.

Windows/macOS users can develop through this container or run the release inside
a full supported Linux VM. Browser access to an installed panel works independently
of the workstation OS. Native Windows/macOS hosting installation is not implemented.
See `PLATFORMS.md` and `INSTALL.md`.
