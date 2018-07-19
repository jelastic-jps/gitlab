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

resp = jelastic.env.control.AddContainerEnvVars({
    envName: envName,
    session: session,
    nodeGroup: "runner",
    vars: {
        CI_SERVER_URL: "https://"+domain+"/ci"
    }
});

//executing custom deployment hook script on master node
if (resp.result != 0) return resp
resp = jelastic.env.control.ExecCmdById(envName, session, getParam('nodeId'), toJSON([{ command:'/bin/bash undeployLE.sh'}]), true);

//restarting runners
if (resp.result != 0) return resp;
return jelastic.env.control.ExecCmdByGroup(envName, session, 'runner', toJSON([{ command:'service docker restart'}]), true, true);
