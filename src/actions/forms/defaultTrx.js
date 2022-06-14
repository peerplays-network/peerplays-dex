import {trxBuilder} from "./trxBuilder";
import {getStore} from "../store";

export const defaultTrx = async ({trx, password, keyType}) => {
    const result = {
        success: false, 
        transactionError: ''
    };
    const {loginData, accountData} = getStore();

    let activeKey = '';

    if(keyType === 'password') {
        activeKey = loginData.formPrivateKey(password, 'active');
    } else if(keyType === 'active') {
        activeKey = loginData.formPrivateKey(password);
    } else if(keyType === 'whaleVault') {
        activeKey = {whaleVaultInfo:{keyType:"active", account: accountData.name}}
    }

    try {
        const trxResult = await trxBuilder([trx], [activeKey]);
        if(trxResult){
            result.success = true;
            result.callbackData = trxResult;
        }
        return result;
    } catch(e) {
        result.transactionError = e.message.split(":")[0].replace(/\s+/g,"_")
        return result;
    }   

};