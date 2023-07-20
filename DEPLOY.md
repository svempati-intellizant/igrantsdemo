# How to deploy:

This web app can be deployed in a linux box running either ubuntu 20 lts or ubuntu 22 lts

# System Deps:

In-order to run this web-app we need docker and nginx to be running

## Docker:

 * Setup docker following the instructions provided here
    * https://docs.docker.com/engine/install/ubuntu/
 * Note : 
    * This web app was tested to run on 
        * Docker version 24.0.4, build 3713ee1
        * Docker Compose version v2.19.1
    * Make sure to ensure that docker can run as an non root user. ref: https://docs.docker.com/engine/install/linux-postinstall/

## Nginx
 * Setup nginx following the instructions provided here
     * https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-22-04
 * Note : 
    * This web app was tested to run on 
      * nginx version: nginx/1.18.0 (Ubuntu)

## Sanity check
 * Ensure that both docker and nginx are running using the following command

```bash
# docker status
systemctl status docker
# nginx status
systemctl status nginx
```

## Deploying the UI, Backend, DB and RiskApi

 * Check for run.sh file present in the root location of the repo and run it.
 * Note:
   - Ensure that you have the mongodb dump saved in `mongo-dump/` before you run this script.

 ```bash
 bash run.sh
 ```



