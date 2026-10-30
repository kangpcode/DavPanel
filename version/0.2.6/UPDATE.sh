#!/bin/bash

# Update from DavPanel 0.2.5 to 0.2.6

# new version
NEW_PANEL_VERSION="0.2.6"

# needed for alpine docker compose
sed -i '/www-data/s/^/# /' nginx.conf


# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
RESET='\033[0m'

# Directories
DAVADMIN_DIR="/usr/local/admin/"
DAVCLI_DIR="/usr/local/admin/scripts/"
DAVPANEL_LOG_DIR="/var/log/davpanel/"
SERVICES_DIR="/etc/systemd/system/"
TEMP_DIR="/tmp/"

DAVPANEL_DIR="/usr/local/panel/"
CURRENT_PANEL_VERSION=$(< ${DAVPANEL_DIR}/version)


LOG_FILE="${DAVPANEL_LOG_DIR}admin/notifications.log"
DEBUG_MODE=0


# block updates for older versions!
required_version="0.2.1"

if [[ "$CURRENT_PANEL_VERSION" < "$required_version" ]]; then
    # Version is less than 0.2.1, no update will be performed
    echo ""
    echo "NO UPDATES FOR VERSIONS =< 0.1.9 - PLEASE REINSTALL DAVPANEL"
    echo "Annoucement: https://community.davpanel.com/d/65-important-update-davpanel-version-021-announcement"
    echo ""
    exit 0
else
    # Version is 0.2.1 or newer
    echo "Starting update.."
fi




# Check if the --debug flag is provided
for arg in "$@"
do
    if [ "$arg" == "--debug" ]; then
        DEBUG_MODE=1
        break
    fi
done






# HELPERS


# Display error and exit
radovan() {
    echo -e "${RED}Error: $2${RESET}" >&2
    exit $1
}


# Progress bar script
PROGRESS_BAR_URL="https://raw.githubusercontent.com/pollev/bash_progress_bar/master/progress_bar.sh"
PROGRESS_BAR_FILE="progress_bar.sh"
wget "$PROGRESS_BAR_URL" -O "$PROGRESS_BAR_FILE" > /dev/null 2>&1

if [ ! -f "$PROGRESS_BAR_FILE" ]; then
    echo "Failed to download progress_bar.sh"
    exit 1
fi

# Source the progress bar script
source "$PROGRESS_BAR_FILE"

# Dsiplay progress bar
FUNCTIONS=(

    #notify user we started
    print_header

    # nothing for 026
    #update_docker_images

    # update docker davpanel iamge
    download_new_panel

    # update admin from github
    download_new_admin

    # for 026 dns only
    dns_key_and_reload

    # update davcli
    davcli_update

    # ping us
    verify_license
    
    # davpanel/davpanel should be downloaded now!
    docker_compose_up_with_newer_images

    # if user created a post-update script, run it now
    run_custom_postupdate_script

    # yay! we made it
    celebrate

    # show to user what was done and how to restore previous version if needed!
    post_install_message

)

TOTAL_STEPS=${#FUNCTIONS[@]}
CURRENT_STEP=0

update_progress() {
    CURRENT_STEP=$((CURRENT_STEP + 1))
    PERCENTAGE=$(($CURRENT_STEP * 100 / $TOTAL_STEPS))
    draw_progress_bar $PERCENTAGE
}

main() {
    # Make sure that the progress bar is cleaned up when user presses ctrl+c
    enable_trapping
    
    # Create progress bar
    setup_scroll_area
    for func in "${FUNCTIONS[@]}"
    do
        # Execute each function
        $func
        update_progress
    done
    destroy_scroll_area
}



# print fullwidth line
print_space_and_line() {
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
}



# END helper functions




dns_key_and_reload(){
    
    # generate key
    docker run -it --rm \
        -v /etc/bind/:/etc/bind/ \
        --entrypoint=/bin/sh \
        ubuntu/bind9:latest \
        -c 'rndc-confgen -a -A hmac-sha256 -b 256 -c /etc/bind/rndc.key'
    
    # add to file
    # Define file paths
    named_conf_local="/etc/bind/named.conf.local"
    rndc_key="/etc/bind/rndc.key"

# Check if /etc/bind/rndc.key is already in named.conf.local
if ! grep -q "$rndc_key" "$named_conf_local"; then
    # Create a temporary file
    temp_file=$(mktemp)

    cat << EOF > "$temp_file"
// It is recommended to create a key and configure Bind to listen to commands
// sent via rndc. However, it will function just fine without the following
// four lines.
include "$rndc_key";
controls {
    inet 127.0.0.1 allow { localhost; } keys { "rndc-key"; };
};
EOF

    # Append the contents of the original named.conf.local to the temporary file
    cat "$named_conf_local" >> "$temp_file"

    # Move the temporary file to replace the original named.conf.local
    mv "$temp_file" "$named_conf_local"

    echo "The necessary configuration has been added to $named_conf_local."

    docker restart davpanel_dns
    
    echo "davpanel_dns dontainer restarted to apply the new conf from: $named_conf_local."

    
else
    echo "$rndc_key is already configured in $named_conf_local."
fi



}







# START MAIN FUNCTIONS



# Function to write notification to log file
write_notification() {
  local title="$1"
  local message="$2"
  local current_message="$(date '+%Y-%m-%d %H:%M:%S') UNREAD $title MESSAGE: $message"

  echo "$current_message" >> "$LOG_FILE"
}



# logo
print_header() {
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
    echo -e "   ____                         _____                      _  "
    echo -e "  / __ \                       |  __ \                    | | "
    echo -e " | |  | | _ __    ___  _ __    | |__) | __ _  _ __    ___ | | "
    echo -e " | |  | || '_ \  / _ \| '_ \   |  ___/ / _\" || '_ \ / _  \| | "
    echo -e " | |__| || |_) ||  __/| | | |  | |    | (_| || | | ||  __/| | "
    echo -e "  \____/ | .__/  \___||_| |_|  |_|     \__,_||_| |_| \___||_| "
    echo -e "         | |                                                  "
    echo -e "         |_|                                                  "

    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -

    echo -e "Starting update to DavPanel version $NEW_PANEL_VERSION"
    echo -e ""
    echo -e "Changelog: https://davpanel.com/docs/changelog/$NEW_PANEL_VERSION"        
    printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' -
    echo -e ""
}


update_docker_images() {
    #davcli docker-update_images
    #bash /usr/local/admin/scripts/docker/update_images
    echo "Downloading latest Nginx and Apache images from https://hub.docker.com/u/davpanel"
    echo ""
    nohup sh -c "echo davpanel/nginx:latest davpanel/apache:latest | xargs -P4 -n1 docker pull" </dev/null >nohup.out 2>nohup.err &
}


davcli_update(){
    echo "Updating DavCLI commands from https://storage.googleapis.com/davpanel/${NEW_PANEL_VERSION}/get.davpanel.co/downloads/${NEW_PANEL_VERSION}/davcli/davcli-main.tar.gz"
    echo ""
    mkdir -p ${TEMP_DIR}davcli
    wget -O ${TEMP_DIR}davcli.tar.gz "https://storage.googleapis.com/davpanel/${NEW_PANEL_VERSION}/get.davpanel.co/downloads/${NEW_PANEL_VERSION}/davcli/davcli-main.tar.gz"
    cd ${TEMP_DIR} && tar -xzf davcli.tar.gz -C ${TEMP_DIR}davcli
    rm -rf /usr/local/admin/scripts/
    
    cp -r ${TEMP_DIR}davcli/ /usr/local/admin/scripts/
    rm ${TEMP_DIR}davcli.tar.gz 
    rm -rf ${TEMP_DIR}davcli

    cp /usr/local/admin/scripts/davcli /usr/local/bin/davcli
    chmod +x /usr/local/bin/davcli
    chmod +x -R /usr/local/admin/scripts/
    davcli commands
    echo "# davcli aliases
    ALIASES_FILE=\"/usr/local/admin/scripts/aliases.txt\"
    generate_autocomplete() {
        awk '{print \$NF}' \"\$ALIASES_FILE\"
    }
    complete -W \"\$(generate_autocomplete)\" davcli" >> ~/.bashrc
    
    source ~/.bashrc
}



run_custom_postupdate_script() {

    echo "Checking if post-update script is provided.."
    echo ""
    # Check if the file /root/davpanel_run_after_update exists
    if [ -f "/root/davpanel_run_after_update" ]; then
        echo " "
        echo "Running post update script: '/root/davpanel_run_after_update'"
        echo "https://dev.davpanel.com/customize.html#After-update"
        bash /root/davpanel_run_after_update

    fi
}


download_new_admin() {

    mkdir -p $DAVADMIN_DIR
    echo "Updating DavAdmin from https://github.com/kangpcode/davadmin"
    echo ""
    cd $DAVADMIN_DIR
    #stash is used for demo
    git stash
    git pull
    git stash pop

    # need for csf
    chmod +x ${DAVADMIN_DIR}modules/security/csf.pl

    # temp fix for 0.2.5
    if [ -f /etc/debian_version ]; then
        pip3 install --force-reinstall zope.event --break-system-packages
    else
        pip3 install --force-reinstall zope.event
    fi

    mv /etc/davpanel/davadmin/config/terms /etc/davpanel/davadmin/config/terms_accepted_on_update
    
    service admin restart
    
}



download_new_panel() {

    mkdir -p $DAVPANEL_DIR
    echo "Downloading latest DavPanel image from https://hub.docker.com/r/davpanel/davpanel"
    echo ""
    docker pull davpanel/davpanel
}


docker_compose_up_with_newer_images(){

  echo "Restarting DavPanel docker container.."
  echo ""
  docker stop davpanel &&  docker rm davpanel
  echo ""
  cd /root  
  docker compose up -d --no-deps --build davpanel

  #cp version file
  mkdir -p /usr/local/panel/  > /dev/null 2>&1
  docker cp davpanel:/usr/local/panel/version /usr/local/panel/version
}



verify_license() {

    # Get server ipv4
    current_ip=$(curl -s https://ip.davpanel.co || wget -qO- https://ip.davpanel.co)

    echo "Checking DavPanel license for IP address: $current_ip" 
    echo ""
    server_hostname=$(hostname)

    license_data='{"hostname": "'"$server_hostname"'", "public_ip": "'"$current_ip"'"}'

    response=$(curl -s -X POST -H "Content-Type: application/json" -d "$license_data" https://api.davpanel.co/license-check)

    #echo "Response: $response"
}




celebrate() {

    print_space_and_line

    echo ""
    echo -e "${GREEN}DavPanel successfully updated to ${NEW_PANEL_VERSION}.${RESET}"
    echo ""

    # remove the unread notification that there is new update
    sed -i 's/UNREAD New DavPanel update is available/READ New DavPanel update is available/' $LOG_FILE

    # add notification that update was successful
    write_notification "DavPanel successfully updated!" "DavPanel successfully updated from $CURRENT_PANEL_VERSION to $NEW_PANEL_VERSION"
}



post_install_message() {

    print_space_and_line

    # Instructions for seeking help
    echo -e "\nIf you experience any problems or need further assistance, please do not hesitate to reach out on our community forums or join our Discord server for 
support:"
    echo ""
    echo "👉 Forums: https://community.davpanel.com/"
    echo ""
    echo "👉 Discord: https://discord.davpanel.com/"
    echo ""
    echo "Our community and support team are ready to help you!"
}



# main execution of the script
main
