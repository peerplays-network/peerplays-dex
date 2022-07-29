import {getStore} from "../store";
import {trxBuilder} from "./trxBuilder";
import {getDefaultFee} from "./getDefaultFee";
import {dbApi} from "../nodes";
import {formAssetData} from "../assets";

export const assetUpdateIssuer = async (data, result) => {
    const {loginData, accountData, pageData} = getStore();
    const issuer = accountData.id;

    const asset_to_update = await formAssetData({symbol: data.mainAsset}).then(e => e.id);
    const new_options = pageData.basicData.options;
    const new_issuer = await dbApi('get_account_by_name', [data.assetOwner]).then(e => e.id);

    const trx = {
        type: 'asset_update',
        params: {
            fee: getDefaultFee(),
            issuer,
            new_issuer,
            asset_to_update,
            new_options
        }
    };

    const keyType = data.keyType;
    const password = data.password;
    let ownerKey = '';

    if(keyType === 'password') {
        ownerKey = loginData.formPrivateKey(password, 'owner');
    } else if(keyType === 'owner') {
        ownerKey = loginData.formPrivateKey(password);
    }
    
    try {
        const trxResult = await trxBuilder([trx], [ownerKey]);
        if(trxResult){
            result.success = true;
            result.callbackData = trxResult;
        }
        return result;
    } catch(e) {
        result.transactionError = e.message.toLowerCase().split(":")[0].replace(/\s+/g,"_");
        return result;
    }   

};