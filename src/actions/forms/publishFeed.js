import {formAssetData} from "../assets";
import {setPrecision} from "../assets/setPrecision";
import {getDefaultFee} from "./getDefaultFee";
import {trxBuilder} from "./trxBuilder";
import {getStore} from "../store";

export const publishFeed = async (data, result) => {
    const {loginData, accountData} = getStore();
    const {forceSettlementPrice, cer, mcr, mssr, core_exchange_rate, settlement_price} = data;

    const baseAsset = await formAssetData({asset_id: settlement_price.base.asset_id});
    const quoteAsset = await formAssetData({asset_id: settlement_price.quote.asset_id});
    const mainAsset = await formAssetData({symbol: data.feeAsset});

    let helpBase = await setPrecision(core_exchange_rate.base.amount, baseAsset.precision);

    const price_core_exchange_rate = {
        base: core_exchange_rate.base,
        quote: {
            amount: (cer*helpBase).toFixed(mainAsset.precision)*(10**mainAsset.precision),
            asset_id: core_exchange_rate.quote.asset_id
        }
    };

    let helpQuote = await setPrecision(core_exchange_rate.quote.amount, quoteAsset.precision);

    const price_settlement_price = {
        base: settlement_price.base,
        quote: {
            amount: (forceSettlementPrice*helpQuote).toFixed(quoteAsset.precision)*(10**quoteAsset.precision),
            asset_id: settlement_price.quote.asset_id
        }
    };

    const price_feed = {
        settlement_price: price_settlement_price,
        maintenance_collateral_ratio: mcr*(10**3),
        maximum_short_squeeze_ratio: mssr*(10**3),
        core_exchange_rate: price_core_exchange_rate
    };

    const trx = {
        type: 'asset_publish_feed',
        params: {
            fee: getDefaultFee(),
            publisher: accountData.id, // account from accountData
            asset_id: baseAsset.id,
            feed: price_feed
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

    } catch(e) {
        result.errors['feedProducer'] = e.message;
        return result;
    }

    return result;
};