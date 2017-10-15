//@req(pswd, domain, next)
import com.hivext.api.core.utils.Transport;

//domain = "${env.domain}";
/** 
 * creating Gitlab impersonation token
 */

//using root user
var login = "root",
    userId = 1;

var t = new Transport();

var resp = post("https://" + domain + "/api/v4/session/", {
    login: login,
    password: pswd
}, {})
if (resp.result == 99) return resp;
resp = toNative(resp);

var privateToken = resp.private_token;
if (!privateToken) return {
    result: 99,
    error: "can't get personal token",
    respone: resp
};

var resp = post("https://" + domain + "/api/v4/users/" + userId + "/impersonation_tokens", {
    "name": "token-for-jelastic",
    "scopes[]": "api"
}, {
    "PRIVATE-TOKEN": privateToken
});
if (resp.result == 99) return resp;
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

function post(url, params, headers) {
    var i = 0,
        sleep = 10000,
        ntimes = 12;

    //trying [ntimes] with [sleep] ms delay between two requests 
    while (i++ < ntimes) {
        try {
            return t.post(url, params, headers);
        } catch (e) {
            if (i == ntimes) return {
                result: 99,
                error: e
            };
            else java.lang.Thread.sleep(sleep);
        }
    }
}
