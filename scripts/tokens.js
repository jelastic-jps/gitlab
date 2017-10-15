//@req(pswd, domain, next)
import com.hivext.api.core.utils.Transport;

/** 
 * creating Gitlab impersonation token
 */
//using root user
var login = "root", userId = 1;

var t = new Transport();
var resp = t.post("https://" + domain + "/api/v4/session/", {
    login: login,
    password: pswd
}, {});

resp = toNative(resp);
var privateToken = resp.private_token;
if (!privateToken) return {
    result: 99,
    error: "can't get personal token",
    respone: resp
};

var resp = t.post("https://" + domain + "/api/v4/users/" + userId + "/impersonation_tokens", {
    "name": "token-for-jelastic",
    "scopes[]": "api"
}, {
    "PRIVATE-TOKEN": privateToken
});

resp = toNative(resp);
var impToken = resp.token;
if (!impToken) return {
    result: 99,
    error: "can't get impersonation token",
    respone: resp
};

/** 
 * creating Jelastic API token
 */
var apiList = ["environment.control.CreateEnvironment", "environment.control.RedeployContainersByGroup"];
var resp = jelastic.users.auth.CreateToken({
    session: session,
    apiList: apiList,
    description: "token-for-gitlab"
});

if (resp.result != 0) return resp;
var jToken = resp.token.key;

resp = {
    result: 0,
    onAfterReturn: {}
};
resp.onAfterReturn[next] = {
    GIT_IMP_TOKEN: impToken,
    J_TOKEN: jToken
};
return resp;
