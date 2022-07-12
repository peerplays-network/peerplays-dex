import {trxBuilder} from "./trxBuilder";
import {Asset} from "../../classes/asset";
import {getStore} from "../store";
import {getDefaultFee} from "./getDefaultFee";
import {defaultToken} from "../../params/networkParams";

export const sellBuy = async (data, result) => {
    if (data.sellAsset === data.buyAsset) {
        result.errors['buyAsset'] = 'sameAsset';
        result.errors['sellAsset'] = 'sameAsset';
        return result;
    }

    if (data.sellAsset !== defaultToken && data.buyAsset !== defaultToken) {
        result.errors['buyAsset'] = 'assetsShouldBeSame';
        result.errors['sellAsset'] = 'assetsShouldBeSame';
        return result;
    }

    const {loginData, accountData} = getStore();
    const seller = accountData.id;

    const sell = {symbol: '', amount: 0};
    const buy = {...sell};

    if(data.type && data.type === 'sell') {
        sell.symbol = data.buyAsset;
        sell.amount = data.amount_to_receive;
        buy.symbol = data.sellAsset;
        buy.amount = data.amount_to_sell;
    } else {
        sell.symbol = data.sellAsset;
        sell.amount = data.amount_to_sell;
        buy.symbol = data.buyAsset;
        buy.amount = data.amount_to_receive;
    }

    const sellAsset = await new Asset(sell).getDataBySymbol();
    const buyAsset = await new Asset(buy).getDataBySymbol();


    const amount_to_sell = {
        amount: Math.round(sellAsset.addPrecision()),
        asset_id: sellAsset.id
    };

    const min_to_receive = {
        amount: Math.round(buyAsset.addPrecision()),
        asset_id: buyAsset.id
    };

    const fee = getDefaultFee();

    const expiration = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365).toISOString();

    const trx = {
        type: 'limit_order_create',
        params: {
            fee,
            seller,
            amount_to_sell,
            min_to_receive,
            expiration,
            fill_or_kill: false,
            extensions: []
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
        result.transactionError = e.message.split(":")[0].replace(/\s+/g,"_");
        return result;
    }

};