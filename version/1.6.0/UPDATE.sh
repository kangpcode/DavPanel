#!/bin/bash

# https://github.com/stefanpejcic/OpenPanel/issues/671#issuecomment-3242952264

echo "Adding support for custom SSL on DavPanel GUI.."
wget -4 -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/fc1b6503cc62e3d61abab6473e42175e63fb7436/davpanel/service/service.config.py && docker restart davpanel

echo "Adding support for custom SSL on DavAdmin GUI.."
wget -4 -O /etc/davpanel/davadmin/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/service/service.config.py


echo "Fixing 403 error on phpmyadmin autologin for users created before 1.4.5"
wget -4 -O /etc/davpanel/mysql/phpmyadmin/pma.php https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/mysql/phpmyadmin/pma.php

for path in /home/*/pma.php; do
    if [ -d "$path" ]; then
        rm -rf "$path"
        cp /etc/davpanel/mysql/phpmyadmin/pma.php "$path"
        echo "- Fix applied to: $path"
    fi
done

echo "Fixing syntax of Nginx VHosts template causing 400 error when Elementor is used on WP with pretty-permalinks.."
sed -i 's/index\.php\$is_args\?\$args/index.php?\$args/g' /etc/davpanel/nginx/vhosts/1.1/docker_nginx_domain.conf
sed -i 's/index\.php\$is_args\?\$args/index.php?\$args/g' /etc/davpanel/nginx/vhosts/1.1/docker_openresty_domain.conf

for userdir in /home/*/; do
    username=$(basename "$userdir")
    target_dir="$userdir/docker-data/volumes/${username}_webserver_data/_data"
    if [ -d "$target_dir" ]; then
        echo "Processing $target_dir..."
        for conf_file in "$target_dir"/*.conf; do
            [ -f "$conf_file" ] || continue
            echo "  Checking VHosts file: $conf_file"
            sed -i 's/index\.php\$is_args\?\$args/index.php?\$args/g' "$conf_file"
        done
    fi
done
