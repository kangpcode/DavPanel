#!/bin/bash

wget -O /etc/davpanel/ofelia/users.ini https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/ofelia/users.ini

for dir in /home/*; do
    file="$dir/httpd.conf"
    user=$(basename "$dir")

    if [[ -f "$file" ]]; then
        cp /etc/davpanel/ofelia/users.ini $dir/crons.ini
    fi

    : '
    todo: edit compose.yml file and .env for use
    
    https://github.com/kangpcode/davpanel-configuration/commit/348eb898657d9d4443e37a79e79796e4d3a6306c

    https://github.com/kangpcode/davpanel-configuration/commit/5230e2e90056ca669f8c83f79bbb2fd018728140
    '

done
