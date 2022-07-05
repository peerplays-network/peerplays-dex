import {getGlobalHistory, getOrderBook, getPairData, getPairStats, getUserOrders, getUserOrdersHistory} from "./index";
import {editStorage, getStorage} from "../../storage";
import {store} from "../../../index";
import {dbApi} from "../../nodes";
import {loadExchangeData} from "../../../dispatch/exchangeData";
import {getAccountData, getStore} from "../../store";

const editActivePair = (pair) => {
    editStorage('exchanges', {active: pair});
    let list = getStorage('exchanges').list;
    const defaultPair = pair.split('_').join(' / ');
    const reversedPair = pair.split('_').reverse().join(' / ');

    const includesReversed = list.includes(reversedPair);
    const includesDefault = list.includes(defaultPair);

    if(!includesReversed && includesDefault) return;

    if (includesReversed) {
        list = list.filter(el => el !== reversedPair);
    }

    list.unshift(defaultPair);
    editStorage('exchanges', {list});
};

const reloadData = () => {
    loadExchangeData();
    const tvData = getStore().tradingView;
    tvData && tvData.getList();
};

export const unsubscribeFromMarket = () => {
    const currentPair = getStore().pageData.pair;
    return dbApi('unsubscribe_from_market', [reloadData, currentPair.base.id, currentPair.quote.id]);
};

export const fetchExchangeData = async (newPair) => {

    const [newQuote, newBase] = newPair.split('_');
    const currentPair = getStore().pageData.pair;

    let pair = currentPair;
    console.log(getStore().pageData)
    if(!pair || pair.quote.symbol !== newQuote || pair.base.symbol !== newBase){
        // pair = await getPairData(newPair);

        if(currentPair){
            unsubscribeFromMarket();
        }
        editActivePair(`${newQuote}_${newBase}`);
        
        dbApi('subscribe_to_market', [reloadData, pair.base.id, pair.quote.id]);
    }

    if(!pair) return false;

    const stats = await getPairStats(pair);
    const orderBook = await getOrderBook(pair, stats);
    const globalHistory = await getGlobalHistory(pair);

    let userBook, userHistory;
    const account = getAccountData().name;

    if(account){
        userBook = await getUserOrders(pair, account);
        userHistory = await getUserOrdersHistory(pair, account);
    }

    return {pair, stats, orderBook, globalHistory, userBook, userHistory};
};
