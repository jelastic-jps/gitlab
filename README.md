<p align="center"> 
<img src="images/gitlab-logo.png" alt="GitLab logo" width="100">
</p>

# DevOps Lab - GitLab Server

Dedicated GitLab server for managing source code, building, and deploying projects. Secured with built-in platform SSL or Let's Encrypt SSL certificates for custom domains. Runners are automatically scaled vertically, with the ability to configure automatic horizontal scaling in just a few clicks.


## Environment Topology

This package creates a dedicated **DevOps Lab** environment that contains two system containers - one for GitLab Server with Docker Hub Registry and the other one for GitLab Runner. Automatic vertical scaling is enabled by default, and [horizontal scaling](https://www.virtuozzo.com/application-platform-docs/automatic-horizontal-scaling/) can be configured for runners as needed. The default software stacks utilized in the package are the following:

- [Docker Engine CE](https://hub.docker.com/r/jelastic/dockerce) with the docker-compose utility
- [GitLab Community Edition](https://github.com/jelastic/docker-gitlab)

<p align="center"> 
<img src="images/topo.png" alt="DevOps Lab topology" width="330">
</p>

Automation scripts inside the package perform the following actions:

- Creates two system containers with pre-installed Docker Engine CE and docker-compose utility.
- Generates and installs the platform's [built-in SSL](https://www.virtuozzo.com/application-platform-docs/built-in-ssl/) or [Let’s Encrypt SSL certificates](https://www.virtuozzo.com/company/blog/free-ssl-certificates-with-lets-encrypt/), as well as shares them with Runners via NFS volume.
- Injects dynamic environment variables such as tokens, passwords, and environment domain.
- Deploys GitLab Server and Container Registry via [docker-compose.yml](https://github.com/jelastic/docker-gitlab/blob/master/docker-compose.yml) in one Docker Engine node.
- Creates one Runner in a separate Docker Engine and registers it automatically in the GitLab Server.
- Automates the discovery of newly added Runners upon horizontal scaling.


## Deployment to Cloud

To get your DevOps Lab solution, click the "**Deploy to Cloud**" button below, specify your email address within the widget, choose one of the [Virtuozzo Public Cloud Providers](https://www.virtuozzo.com/application-platform-partners/), and confirm by clicking **Install**.

[![Deploy to Cloud](https://raw.githubusercontent.com/jelastic-jps/common/main/images/deploy-to-cloud.png)](https://www.virtuozzo.com/install/?manifest=https://raw.githubusercontent.com/jelastic-jps/gitlab/refs/heads/master/manifest.jps)

> If you already have a Virtuozzo Application Platform (VAP) account, you can deploy this solution from the [Marketplace](https://www.virtuozzo.com/application-platform-docs/marketplace/) or [import](https://www.virtuozzo.com/application-platform-docs/environment-import/) a manifest file from this repository.


## Installation Process

In the opened installation window at the VAP dashboard, provide a preferred environment and display names, choose a region (if available), and confirm the installation. By default, the platform will issue a built-in SSL certificate for your application that will be valid for the platform domain. If you plan to use a custom domain name, tick the optional box to attach a public IP and get a free Let’s Encrypt SSL certificate.

![GitLab server deployment wizard](images/gitlab-server-deployment-wizard.png)

Your DevOps Lab application will be automatically installed in a few minutes. Access credentials will be sent to your email address and displayed in the dashboard notification window.

![GitLab server installation success](images/gitlab-server-success.png)


## Manage GitLab Server

During package deployment, the platform pre-installs several add-ons for easier management of your GitLab Server environment. You can find the following ones by clicking the **Add-ons** button next to your server node in the dashboard:

- **Let's Encrypt + Custom Domains** - to install the Let's Encrypt add-on (if it was not selected during the installation).
- **Let's Encrypt Free SSL** - to update your free SSL certificate or set the custom domain name.
- **GitLab SMTP Settings** - to configure the email notification server for GitLab.
- **Update GitLab Server** - to update your GitLab Server to the latest version.

![GitLab Sever add-ons](images/gitlab-server-addons.png)
