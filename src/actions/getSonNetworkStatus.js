import {dbApi} from "./nodes";

export const getSonNetworkStatus = async () => {

    let result = {};
    let status = [];
    let activeSons = 0
    const emptyResult = {status: [], isSonNetworkOk: false};
    try {
        const gpo = await dbApi('get_global_properties')
        if(!gpo.active_sons || gpo.active_sons.length == 0) {
            return emptyResult;
        }
        const sonIds = gpo.active_sons.map(active_son => active_son.son_id);
        const sons = await dbApi('get_sons', [sonIds])
        for (const son of sons) {
            if(son){
                const sonStatisticsObject =  await dbApi('get_objects', [[son.statistics]]).then(e => e[0]);
                const now = new Date();
                const utcNowMS = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()).getTime();
                if(new Date(sonStatisticsObject.last_active_timestamp).getTime() + (gpo.parameters.extensions.son_heartbeat_frequency * 1000) > utcNowMS) {
                    status.push([son.id, "OK, regular SON heartbeat"])
                    activeSons = activeSons + 1
                } else {
                    if (new Date(sonStatisticsObject.last_active_timestamp).getTime() + (gpo.parameters.extensions.son_down_time * 1000) > utcNowMS) {
                        status.push([son.id, "OK, irregular SON heartbeat, but not triggering SON down proposal"])
                     } else {
                        status.push([son.id, "NOT OK, irregular SON heartbeat, triggering SON down proposal"])
                     }
      
                }
            } else{
                status.push([son.id, "NOT OK, invalid SON id"])
            }
        }
        result = {
            status: status,
            isSonNetworkOk: (activeSons / gpo.parameters.extensions.maximum_son_count) > (2/3) ? true : false,
        };
        return result;          

    } catch(e){
        console.log(e)
        return emptyResult;
    }
};