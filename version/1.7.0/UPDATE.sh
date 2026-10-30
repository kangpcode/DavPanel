#!/bin/bash
echo 
echo "Updating service file to show timestamp in docker log for davpanel service.."
wget -O /etc/davpanel/davpanel/service/service.config.py https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/service/service.config.py
docker restart davpanel

echo 
echo "Disabling CoreRuleSet REQUEST-941-APPLICATION-ATTACK-XSS.conf"
mv /etc/davpanel/caddy/coreruleset/rules/REQUEST-941-APPLICATION-ATTACK-XSS.conf /etc/davpanel/caddy/coreruleset/rules/REQUEST-941-APPLICATION-ATTACK-XSS.conf.disabled

echo 
echo "Adding 'ssl' module for Community edition.."
wget -O /etc/davpanel/davadmin/config/features.json https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davadmin/config/features.json

echo 
echo "Increasing activity_items_per_page value from 25 to 100"
davcli config update activity_items_per_page 100

echo
echo "Setting limits for all existing users..."
for home_dir in /home/*; do
    [[ -d "$home_dir" ]] || continue
    env_file="$home_dir/.env"
    [[ -f "$env_file" ]] || continue

    # Windows \r characters
    env_data=$(tr -d '\r' < "$env_file")
    eval "$env_data"  # safe for trusted env files

    [[ -z "$USER_ID" ]] && continue

    # --- CPU Limit ---
    if [[ -n "$TOTAL_CPU" ]]; then
        if [[ "$TOTAL_CPU" == "0" ]]; then
            cpu_limit="infinity"
            systemctl set-property "user-${USER_ID}.slice" CPUQuota=infinity
        else
            cpu_percent=$(( TOTAL_CPU * 100 ))
            cpu_limit="${cpu_percent}%"
            systemctl set-property "user-${USER_ID}.slice" CPUQuota="${cpu_percent}%"
        fi
    else
        cpu_limit="none"
    fi

    # --- RAM Limit ---
    if [[ -n "$TOTAL_RAM" ]]; then
        if [[ "$TOTAL_RAM" == "0" ]]; then
            ram_limit="infinity"
            systemctl set-property "user-${USER_ID}.slice" MemoryMax=infinity
        else
            # Add G if numeric
            [[ "$TOTAL_RAM" =~ ^[0-9]+$ ]] && TOTAL_RAM="${TOTAL_RAM}G"
            TOTAL_RAM="${TOTAL_RAM^^}"  # Uppercase unit
            ram_limit="$TOTAL_RAM"
            systemctl set-property "user-${USER_ID}.slice" MemoryMax="$TOTAL_RAM"
        fi
    else
        ram_limit="none"
    fi

    # Single echo per user
    echo "- User: $USER_ID | CPU: $cpu_limit | RAM: $ram_limit"
done

davcli docker-collect_stats --all > /dev/null 2>&1
