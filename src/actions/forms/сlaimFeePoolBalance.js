import {trxBuilder} from "./trxBuilder";
import {getDefaultFee} from "./getDefaultFee";
import {getStore} from "../store";
import {formAssetData} from "../assets";

export const claimFeePoolBalance = async (data, result) => {
    const {loginData, accountData} = getStore();
    const from = accountData.id;
    const asset = accountData.assets.find(e => e.symbol === data.quantityAsset);
    const asset_id = await formAssetData({symbol: data.mainAsset}).then(e => e.id);

    const trx = {
        type: 'asset_claim_pool',
        params: {
            fee: getDefaultFee(),
            issuer: from,
            asset_id,
            amount_to_claim: {
                amount: asset.addPrecision(false, data.quantityClaim),
                asset_id: asset.id
            }
        }
    };

    const password = data.password;
    const keyType = data.keyType;
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
        result.errors['quantityClaim'] = e.message;
        return result;
    }

};