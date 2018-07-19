resp = jelastic.env.control.ExecCmdById(getParam('envName'), session, getParam('nodeId'), toJSON([{ command:'/bin/bash deployLE.sh'}]), true);
if (resp.result != 0) return resp;
return jelastic.env.control.ExecCmdByGroup(getParam('envName'), session, 'runner', toJSON([{ command:'service docker restart'}]), true, true);
