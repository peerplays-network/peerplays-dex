import {trxBuilder} from "./trxBuilder";
import {getStore} from "../store";
import {getDefaultFee} from "./getDefaultFee";

export const updateAccount = async (newData, password, keyType) => {

    const {accountData, loginData} = getStore();

    const trx = {
        type: 'account_update',
        params: {
            ...newData,
            account: accountData.id,
            fee: getDefaultFee()
        }
    };

    let activeKey = '';

    if(keyType === 'password') {
        activeKey = loginData.formPrivateKey(password, 'active');
    } else if(keyType === 'active') {
        activeKey = loginData.formPrivateKey(password);
    } else if(keyType === 'whaleVault') {
        activeKey = {whaleVaultInfo:{keyType:"active", account: accountData.name}}
    }

    return await trxBuilder([trx], [activeKey]);
};