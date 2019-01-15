envName = getParam('envName');
envDomain = getParam('envDomain');
httpsPort =  getParam('action') == 'uninstall' ? 4848 : 443;
scriptName = getParam('action') == 'uninstall' ? 'undeployLE.sh' : 'deployLE.sh';

//getting first custom domain
customDomains = (getParam('customDomains') || "").replace(/^\s+|\s+$/gm , "").split(/\s*[;,\s]\s*/).shift(); 
domain = customDomains || envDomain;

//redefining domain name in cp layer
resp = jelastic.env.control.AddContainerEnvVars({
    envName: envName,
    session: session,
    nodeGroup: "cp",
    vars: {
        GITLAB_HOST: domain,
        REGISTRY_HOST: domain,
        HTTPS_PORT: httpsPort
    }
});
if (resp.result != 0) return resp;

//restart with new env variables 
//executing custom deployment hook script on master node
resp = jelastic.env.control.ExecCmdById(envName, session, getParam('nodeId'), toJSON([{ command:'cd gitlab && docker-compose up -d && cd .. && /bin/bash ' + scriptName}]), true);

//redefining domain name in runner
resp = jelastic.env.control.AddContainerEnvVars({
    envName: envName,
    session: session,
    nodeGroup: "runner",
    vars: {
        CI_SERVER_URL: "https://"+domain+":" + httpsPort + "/ci"
    }
});
if (resp.result != 0) return resp;

//rewriting server url in /srv/docker/gitlab-runner/config.toml 
//and restarting runners
return jelastic.env.control.ExecCmdByGroup(envName, session, 'runner', toJSON([{ command:'sed -i "s|https.*$|$CI_SERVER_URL\\"|g" /srv/docker/gitlab-runner/config.toml && service docker restart'}]), true, true);
