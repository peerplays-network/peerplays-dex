import {Login, PrivateKey} from "peerplaysjs-lib";
import CloudAccount from "../../../classes/cloudAccount";

export const formCloudKeys = ({newLogin, password}) => {

    
    const keys = {};
    const wifs = {};
    const roles = ['active', 'owner', 'memo'];
    
    const generatedKeys = Login.generateKeys(newLogin, password, roles);
    
    for(let role of roles){
        keys[role] = generatedKeys.pubKeys[role].toString();
        wifs[role] = generatedKeys.privKeys[role].toWif()
    }

    return {keys, wifs};
};