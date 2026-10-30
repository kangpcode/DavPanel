#!/bin/bash

echo ""
echo "📥 Downloading crons.ini template.."
mkdir -p /etc/davpanel/ofelia/
wget -q -O "/etc/davpanel/ofelia/users.ini" "https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/ofelia/users.ini" && \
    echo "✔ Template downloaded to /etc/davpanel/ofelia/users.ini"


echo ""
echo "Downloading backups conf for new users.."
wget -O /etc/davpanel/backups/backup.env https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/backups/backup.env

echo ""
echo "Updating docker compose template for new users.."
cp /etc/davpanel/docker/compose/1.0/docker-compose.yml /etc/davpanel/docker/compose/1.0/125-docker-compose.yml
wget -O /etc/davpanel/docker/compose/1.0/docker-compose.yml https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/docker/compose/1.0/docker-compose.yml

echo ""
echo "Downloading script to dump databases.."
wget -O /etc/davpanel/mysql/scripts/dump.sh https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/mysql/scripts/dump.sh
chmod +x /etc/davpanel/mysql/scripts/dump.sh

echo ""
echo "🛠 Creating crons.ini files for each user in /home.."
for dir in /home/*; do
    username=$(basename "$dir")
    CONF_PATH="$dir/crons.ini"

    if [ -f "$CONF_PATH" ] || [ -e "$CONF_PATH" ]; then
        rm -f "$CONF_PATH"
    fi
    touch "$CONF_PATH"
    echo "→ Created: $CONF_PATH"
done

echo ""
echo "⚙ Adding dev_mode option for both DavAdmin and DavPanel.."
FILE="/etc/davpanel/davpanel/conf/davpanel.config"

if ! grep -q "dev_mode" "$FILE"; then
    if grep -q "\[PANEL\]" "$FILE"; then
        sed -i '/\[PANEL\]/a dev_mode=off' "$FILE"
        echo "✔ dev_mode=off added under [PANEL]."
    else
        echo "❌ Error: [PANEL] section doesn't exist in $FILE!"
    fi
else
    echo "✔ dev_mode already exists in config."
fi

echo ""
echo "🔧 Modifying docker-compose.yml and .env for each user..."

for dir in /home/*/; do
    user=$(basename "$dir")
    compose_file="${dir}docker-compose.yml"
    env_file="/home/$user/.env"


    if [ -f "$compose_file" ]; then
        cp "$compose_file" "${dir}024_docker-compose.yml"
        echo "→ Checking $compose_file for $user"

        # Check if backup service exists
        if grep -q "^\s*backup:" "$compose_file"; then
            echo "  ✔ backup: block found"

            # Check if the html_data volume is present
            if grep -A10 "^\s*backup:" "$compose_file" | grep -q "\- html_data:/backup/html:ro"; then
                echo "  ✔ html_data:/backup/html:ro already present"
            else
                # Add html_data:/backup/html:ro under the 'volumes:' section in the backup block
                inserted=0
                awk '
                BEGIN { in_backup=0; in_volumes=0 }
                {
                    if ($1 == "backup:" || $2 == "backup:") { in_backup=1 }
                    if (in_backup && $1 == "volumes:" || $2 == "volumes:") { in_volumes=1 }
                    if (in_backup && in_volumes && $0 ~ /^ *[^-]/ && !inserted) {
                        print "      - html_data:/backup/html:ro"
                        inserted=1
                        in_volumes=0
                        in_backup=0
                    }
                    print $0
                }
                END {
                    if (in_backup && in_volumes && !inserted) {
                        print "      - html_data:/backup/html:ro"
                    }
                }' "$compose_file" > "${compose_file}.tmp" && mv "${compose_file}.tmp" "$compose_file"
                echo "  ✔ html_data:/backup/html:ro added"
            fi
        else
            echo "  ✖ backup: block not found, skipping"
        fi
    else
        echo "❌ $compose_file not found for $user"
    fi

    # --- Update .env file ---
    if [ -f "$env_file" ]; then
        cp "$env_file" "/home/$user/024_.env"
        echo "→ Modifying $env_file for $user"

        # Only insert if BACKUP_CPU not already in the file
        if ! grep -q "BACKUP_CPU=" "$env_file"; then
            awk '
                {
                    if ($0 ~ /^# FILE MANAGER$/ && !inserted) {
                        print "# BACKUP"
                        print "BACKUP_CPU=\"1.0\""
                        print "BACKUP_RAM=\"1.0G\""
                        print ""
                        inserted = 1
                    }
                    print
                }
            ' "$env_file" > "$env_file.tmp" && mv "$env_file.tmp" "$env_file"
            echo "  ✔ Backup config inserted before # FILE MANAGER"
        else
            echo "  ✔ Backup config already present"
        fi
    else
        echo "❌ .env file not found for $user"
    fi
done
