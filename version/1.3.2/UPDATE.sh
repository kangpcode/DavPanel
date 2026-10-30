#!/bin/bash


mkdir -p /etc/davpanel/davpanel/features

echo ""
echo "📥 Downloading default feature set for new users.."
wget -O /etc/davpanel/davpanel/features/default.txt https://raw.githubusercontent.com/kangpcode/davpanel-configuration/refs/heads/main/davpanel/features/default.txt

echo ""
echo "Setting default feature set for all existing users.."


for dir in /home/*; do
  if [ -d "$dir" ]; then
    if [ -f "$dir/.env" ]; then
      ln -sf /etc/davpanel/davpanel/features/default.txt "$dir/features.txt"
      echo "- Default feature set applied for user $dir"
    fi
  fi
done


CONFIG_FILE="/etc/davpanel/davpanel/conf/davpanel.config"
MODULES_TO_CHECK=("mysql" "domains" "autoinstaller" "filemanager" "php")

# Check if the config file exists
if [[ ! -f "$CONFIG_FILE" ]]; then
    echo "Config file not found: $CONFIG_FILE"
    exit 1
fi

# Extract the current enabled_modules (strip quotes)
current_modules=$(grep "^enabled_modules=" "$CONFIG_FILE" | cut -d= -f2 | sed 's/^"\(.*\)"$/\1/')

# Convert to array
IFS=',' read -ra current_array <<< "$current_modules"

# Create a set for quick lookup
declare -A current_set
for mod in "${current_array[@]}"; do
    current_set["$mod"]=1
done

modules_modified=false

# Loop through each required module
for module in "${MODULES_TO_CHECK[@]}"; do
    if [[ -n "${current_set[$module]}" ]]; then
        echo "'$module' is already enabled."
    else
        echo "Adding '$module' to enabled_modules..."
        current_modules="${current_modules},$module"
        modules_modified=true
    fi
done

# Update the config file only if changed
if [ "$modules_modified" = true ]; then
    sed -i "s|^enabled_modules=.*|enabled_modules=\"${current_modules}\"|" "$CONFIG_FILE"
    echo "Updated enabled_modules in config file."
fi


# Function to check if a Docker container is running
is_container_running() {
    docker ps --format '{{.Names}}' | grep -q "^$1$"
}

# Flush Redis if davpanel_redis is running
if is_container_running "davpanel_redis"; then
    echo "Flushing Redis cache in 'davpanel_redis'..."
    docker exec -it davpanel_redis bash -c "redis-cli FLUSHALL"
else
    echo "Container 'davpanel_redis' is not running. Skipping Redis flush."
fi

# Restart DavPanel if running
if is_container_running "davpanel"; then
    echo "Restarting 'davpanel' container..."
    docker restart davpanel
else
    echo "Container 'davpanel' is not running. Skipping restart."
fi
