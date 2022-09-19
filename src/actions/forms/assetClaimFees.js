import {trxBuilder} from "./trxBuilder";
import {getDefaultFee} from "./getDefaultFee";
import {getStore} from "../store";
import {formAssetData} from "../assets";

export const assetClaimFees = async (data, result) => {
    const {loginData, accountData} = getStore();
    const from = accountData.id;

    const asset = await formAssetData({symbol: data.mainAsset});

    const trx = {
        type: 'asset_claim_fees',
        params: {
            fee: getDefaultFee(),
            issuer: from,
            amount_to_claim: {
                amount: asset.addPresion(false, data.quantityAssetFees),
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
        result.transactionError = e.message.toLowerCase().split(":")[0].replace(/\s+/g,"_");
        return result;
    }

};