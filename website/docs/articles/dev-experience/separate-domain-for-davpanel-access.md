---
sidebar_label: "Set a separate domain for DavPanel UI"
---

# How to Use a Custom Domain for the Control Panel Login

To set separate domain just for the DavPanel UI, for example `pejcic.rs`:

1. Add the domain to Caddyfile

  ```bash
  DOMAIN="pejcic.rs" && cat << EOF >> "/etc/davpanel/caddy/Caddyfile"
  
  # START USERPANEL DOMAIN #
  $DOMAIN {
      reverse_proxy localhost:2083
  }
  
  http://$DOMAIN {
      reverse_proxy localhost:2083
  }
  # END USERPANEL DOMAIN #
  EOF
  ```

2. Create an empty file with the domain name so SSL can be generated and renewed:
  ```bash
  touch /etc/davpanel/caddy/domains/pejcic.rs.conf
  ```

3. Restart services
  ```bash
  podman restart caddy davpanel
  ```
