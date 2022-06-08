import {getStore} from "../store";
import {trxBuilder} from "./trxBuilder";
import {getDefaultFee} from "./getDefaultFee";

export const assetFundFeePool = async (data, result) => {
    const {loginData, accountData} = getStore();
    const from = accountData.id;
    const asset = accountData.assets.find(e => e.symbol === data.quantityAsset);

    const trx = {
        type: 'asset_fund_fee_pool',
        params: {
            fee: getDefaultFee(),
            from_account: from,
            asset_id: asset.id,
            amount: asset.addPrecision(false, data.quantity)
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
        result.errors['from'] = e.message;
        return result;
    }

};