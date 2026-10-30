---
sidebar_position: 3
---

# Docker

![davadmin docker settings](/img/admin/adminpanel_docker_settings.png)


To download Docker images, click the "update images" button.

To remove an unnecessary image, click the delete button next to the image and confirm your action in the pop-up modal.


## Docker images

Docker images serve as the foundation for DavPanel user accounts, determining the technology stack available to the user.


### Update images

Updating Docker images involves downloading the latest versions from the davpanel servers, and these updated images will be used only for new users. Existing users' setups will remain unaffected.

To update docker images click on the 'Update images' button:
![davadmin docker update 1](/img/admin/davadmin_docker_update1.png) 

### Delete images

To remove an unnecessary image, click the delete button next to the image and confirm in the pop-up modal:

Step 1.             |  Step 2.
:-------------------------:|:-------------------------:
![davadmin docker delete image step 1](/img/admin/davadmin_docker_delete1.png)  |  ![davadmin docker delete image  step 2](/img/admin/davadmin_docker_delete2.png)


:::info
image can not be deleted if it is in use.
:::


### Add images

Currently images can only be added from terminal: [`docker pull`](https://docs.docker.com/reference/cli/docker/image/pull/)

## Docker info

To view current [docker system info](https://docs.docker.com/reference/cli/docker/system/info/) click on the ![davadmin docker info 1](/img/admin/davadmin_docker_info1.png) button:

![davadmin docker info 1](/img/admin/davadmin_docker_info2.png)


## Total Resource Usage

Under 'Docker Resource Usage Settings' you can configure the maximum memory and CPU percentages of server resources available for all users' Docker containers.

![davadmin docker cpu settings](/img/admin/davadmin_docker_cpu.png)

We advise against setting it above 90% ([BUG#117:Slow TTFB caused by the docker_limit.slice ckgroup ](https://github.com/stefanpejcic/OpenPanel/issues/117)).

