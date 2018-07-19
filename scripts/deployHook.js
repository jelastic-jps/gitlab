envName = getParam('envName');
envDomain = getParam('envDomain');
//getting first custom domain
customDomains = (getParam('customDomains') || "").replace(/^\s+|\s+$/gm , "").split(/\s*[;,\s]\s*/).shift(); 
domain = customDomains || envDomain;

//redefining domain name
resp = jelastic.env.control.AddContainerEnvVars({
    envName: envName,
    session: session,
    nodeGroup: "cp",
    vars: {
        GITLAB_HOST: domain,
        REGISTRY_HOST: domain
    }
});

//restart with new env variables 
//executing custom deployment hook script on master node
if (resp.result != 0) return resp
resp = jelastic.env.control.ExecCmdById(envName, session, getParam('nodeId'), toJSON([{ command:'cd gitlab && docker-compose up -d && cd .. && /bin/bash deployLE.sh'}]), true);


resp = jelastic.env.control.AddContainerEnvVars({
    envName: envName,
    session: session,
    nodeGroup: "runner",
    vars: {
        CI_SERVER_URL: "https://"+domain+"/ci"
    }
});

//rewriting server url in /srv/docker/gitlab-runner/config.toml 
//and restarting runners
if (resp.result != 0) return resp;
return jelastic.env.control.ExecCmdByGroup(envName, session, 'runner', toJSON([{ command:'sed -i "s|https.*$|$CI_SERVER_URL\"|g" /srv/docker/gitlab-runner/config.toml && service docker restart'}]), true, true);
