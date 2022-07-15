import {formAccount} from "../../account/formAccount";
import {getFullAccount} from "../../account/getFullAccount";
import CloudAccount from "../../../classes/cloudAccount";

export const authByLogin = async ({login, password, remember, isWhaleVault}, result) => {
    const fullAcc = await getFullAccount(login, true);

    if(!fullAcc){
        result.errors.login = 'noAcc';
        return result;
    }

    const accData = fullAcc.account;
    const loginData = new CloudAccount();
    
    if(!isWhaleVault) {
        const checkPassword = loginData.checkPassword(password, accData); 
        if(!checkPassword){
            result.errors.password = 'wrongPass';
            return result;
        }
    } else {
        if (window.whalevault) {         
            const res = await window.whalevault.promiseRequestPubKeys("dex", `ppy:${login}`)
            const pubKeys = res.result[`ppy:${login}`];
            if(res.success){
                if(Object.keys(pubKeys).length){
                    const checkWhaleVaultKeys = loginData.checkWhaleVaultPubKeys(pubKeys, accData);
                    if(!checkWhaleVaultKeys){
                        result.errors.login = 'wrongKeysAddedToWhale';
                        return result;
                    }
                }else{
                    result.errors.login = "notAddedToWhaleVault";
                    return result;
                }
            } else{
              result.errors.isWhaleVault = "whaleVaultConnectionError"  ;
              return result;
            }
            
        } else {
            result.errors.isWhaleVault = 'whaleNotInstalled';
            return result;
        }

    }

    const localData = {type: 'cloud', id: fullAcc.account.id, name: fullAcc.account.name};
    const accountData = await formAccount(fullAcc);
    result.success = true;
    result.callbackData = { loginData, accountData, localData, remember };

    return result;
};