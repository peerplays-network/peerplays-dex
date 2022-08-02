import {getBasicAsset, getStore} from "../store";
import {trxBuilder} from "./trxBuilder";
import {getDefaultFee} from "./getDefaultFee";
import { getAssetBySymbol } from "../assets";

export const assetFundFeePool = async (data, result) => {
    const {loginData, accountData} = getStore();
    const basicAsset = getBasicAsset();
    const from = accountData.id;
    const poolAsset = await getAssetBySymbol(data.poolAssetSymbol)
    const amount = data.quantity * (10 ** basicAsset.precision)

    const trx = {
        type: 'asset_fund_fee_pool',
        params: {
            fee: getDefaultFee(),
            from_account: from,
            asset_id: poolAsset.id,
            amount
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