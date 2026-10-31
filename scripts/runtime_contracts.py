"""Check shared runtime identifiers across the panel, admin, CLI and configuration."""

import re
from pathlib import Path


def check_contracts(root):
    errors = []
    expected = "/etc/davpanel/davpanel/conf/davpanel.config"
    files = {
        "davpanel/internal/app/app.go": r'ConfigPath\s*=\s*"([^"]+)"',
        "davadmin/internal/config/config.go": r'DavpanelConfigPath\s*=\s*"([^"]+)"',
        "davcli/config.sh": r'config_file=[\x27"]([^\x27"]+)',
        "davcli/license.sh": r'CONFIG_FILE_PATH=[\x27"]([^\x27"]+)',
    }
    for name, pattern in files.items():
        source = root / name
        if not source.is_file():
            errors.append(f"Missing runtime input: {name}")
            continue
        match = re.search(pattern, source.read_text())
        if not match or match[1] != expected:
            errors.append(f"{name}: config path does not agree with {expected}")
    cli = root / "davcli/davcli"
    bundled = root / "davpanel/davcli"
    if not cli.is_file() or not bundled.is_file() or cli.read_bytes() != bundled.read_bytes():
        errors.append("The installed and container CLI wrappers differ.")
    template = root / "configuration/davpanel/conf/davpanel.config"
    if not template.is_file():
        errors.append("The shared panel config template is missing.")
    compose_file = root / "configuration/docker/compose/docker-compose.yml"
    if compose_file.is_file():
        compose = compose_file.read_text()
        for service in ("davpanel", "davpanel_mysql", "davpanel_redis", "davadmin_ftp"):
            if not re.search(r"^  " + service + r":\s*$", compose, re.M):
                errors.append(f"System compose is missing the expected service: {service}")
        if "image: ghcr.io/kangpcode/davpanel:${VERSION}" not in compose:
            errors.append("System compose does not use the locally built DavPanel image.")
        if "etc/ghcr.io" in compose:
            errors.append("A container registry name was used as a filesystem path.")
    else:
        errors.append("System compose is missing.")
    version_file = root / "davpanel/version"
    env_file = root / "configuration/docker/compose/.env"
    if version_file.is_file() and env_file.is_file():
        match = re.search(r'^VERSION="([^"]+)"', env_file.read_text(), re.M)
        if not match or match[1] != version_file.read_text().strip():
            errors.append("Panel source version and compose default version differ.")
    return errors
