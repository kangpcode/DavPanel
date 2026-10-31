# FTP module for [DavPanel](https://davpanel.co)

Small and flexible docker image with vsftpd server + DavPanel module to allow users to manage ftp sub-users.

### Usage

This image can be used in two ways:
- as an FTP module for DavPanel
- as a standalone FTP server


#### DavPanel Module

To create new FTP accounts:
```bash
davcli ftp-add <NEW_USERNAME> <NEW_PASSWORD> <FOLDER> <DAVPANEL_USERNAME>
```


#### standalone Docker

Installation:
```
docker run -d \
    -p "21:21" \
    -p 21000-21010:21000-21010 \
    --restart=always \
    --name=davadmin_ftp \
    -v /home:/home \
    -v /etc/davpanel/ftp/users:/etc/davpanel/ftp/users
    --memory="1g" --cpus="1" \
    davpanel/ftp
```

Adding accounts:

```
# to create temporary account *(until docker restart):
docker exec -it davadmin_ftp sh -c 'echo -e "${PASSWORD}\n${PASSWORD}" | adduser -h $DIRECTORY -s /sbin/nologin $USERNAME'

# to create permanent ftp account that will be created on docker restart:
echo "$USERNAME|$HASHEDPASSWORD|$DIRECTORY|$UID|$GID" >> /etc/davpanel/ftp/users/users.list
```

-----


### Todo:
- quotas
- ~limits in ftp accounts per user~
- ~create groups~
- ~davpanel interface~
- ~davadmin interface~
- ~additional tweaks: ssl protocols, resource limiting..~
