import {dbApi} from "../../nodes";
import {roundNum} from "../../roundNum";
import {formAssetData, setPrecision} from "../../assets";

const getFeedData = async (asset) => {
    const rawData = await dbApi('get_objects', [[asset.bitasset_data_id]]).then(e => e[0]);
    const callOrders = await dbApi("get_call_orders", [asset.id, 5]).catch(() => []);

    const {base, quote} = rawData.current_feed.settlement_price;
    const sqrt = parseInt(rawData.current_feed.maximum_short_squeeze_ratio, 10) / 1000;

    const baseAsset = await formAssetData({id: base.asset_id});
    const quoteAsset = await formAssetData({id: quote.asset_id});

    const defaultData = {
        val: 0,
        asset: quoteAsset.symbol
    };

    const feed = {...defaultData};
    const margin = {...defaultData};
    const limit = {...defaultData};

    if(!quote.amount || !base.amount) return {feed, limit, margin};

    feed.val = roundNum(setPrecision(base.amount, baseAsset.precision) / setPrecision(quote.amount, quoteAsset.precision));
    margin.val = roundNum(setPrecision(base.amount * 1000, baseAsset.precision) / setPrecision(quote.amount * (sqrt * 1000), quoteAsset.precision));

    if(callOrders.length){
        // console.log(callOrders);
    }

    return {feed, limit, margin}
};

export const getPairStats = async ({quote, base}) => {
    
    const ticker = await dbApi('get_ticker', [base.symbol, quote.symbol]);

    let feedData = false;

    if(base.bitasset_data_id){
        feedData = await getFeedData(base);
    }

    const basicData = {
        price: {
            val: roundNum(ticker.latest)
        },
        change: {
            val: roundNum(ticker.percent_change) || 0
        },
        value: {
            val: roundNum(ticker.quote_volume),
            asset: quote.symbol
        }
    };

    return feedData ? {...basicData, ...feedData} : basicData;
};
