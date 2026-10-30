# Installing DavPanel via Ansible

Use the following **Ansible playbook** to install DavPanel on one or more target machines:

```yaml
---
- name: Install DavPanel on target machine
  hosts: all
  become: true
  vars:
    # Customize installation flags as needed. Full list: https://davpanel.com/install
    davpanel_install_flags: "--debug --username=admin --password=super123"

  tasks:
    - name: Download and run DavPanel installer
      shell: |
        curl -sSL https://davpanel.org | bash -s -- {{ davpanel_install_flags }}
      args:
        executable: /bin/bash
```

Save this as `install-davpanel.yml` and run:

```bash
ansible-playbook -i inventory install-davpanel.yml
```

This will automatically install DavPanel on all machines in your inventory.
