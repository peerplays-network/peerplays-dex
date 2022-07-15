import {
    ChainTypes,
    ChainStore
} from "peerplaysjs-lib";
import {
    formAccount
} from "../account/formAccount";
import {
    dbApi
} from "../nodes";
import {
    getStorage,
    setStorage
} from "../storage";
import CloudAccount from "../../classes/cloudAccount";
import {
    walletToRedux
} from "../../actions/wallet";
import {
    defaultQuote,
    defaultToken
} from "../../params/networkParams";
import {
    Asset
} from "../../classes/asset";
import {
    getStoragedAccount
} from "../account";
import {
    bridgesList
} from "../../params/bridgesApi";
import {
    getPassedTime
} from "../getPassedTime";
import {
    defaultFetch
} from "../defaultFetch";
import {
    getSidechainAccounts
} from '../account/getSidechainAccounts';

const getCloudData = async data => ({
    loginData: new CloudAccount(),
    accountData: await formAccount(data.name)
});

const fetchAccountData = {
    cloud: getCloudData,
    wallet: walletToRedux
};

const getRudexData = (item) => {
    // console.log('---rudex', item);
    return {
        symbol: item.name,
        depositCoin: item.backingCoin,
        withdrawCoin: item.symbol,
        memoSupport: item.memoSupport,
        gateFee: 0,
        gatewayWallet: item.gatewayWallet,
        minAmount: item.minAmount / Math.pow(10, item.precision)
    };
};

const getXbtsxData = (item) => {
    // console.log('---xbtsx', item);
    return {
        symbol: item.name,
        depositCoin: item.backingCoin,
        withdrawCoin: item.symbol,
        memoSupport: item.memoSupport,
        gateFee: 0,
        gatewayWallet: item.issuer,
        minAmount: item.minAmount / Math.pow(10, item.precision)
    };
};

const getCryptoBridgeData = (item) => {
    // console.log('---cryptoBridge', item);
    return {
        symbol: item.backingCoinType,
        depositCoin: item.coinType,
        withdrawCoin: item.coinType,
        memoSupport: item.supportsOutputMemos,
        gateFee: 0,
        gatewayWallet: 'cryptobridge',
        minAmount: 0.02
    };
};

const getGdex2Data = (item) => {
    // console.log('---gdex', item);
    return {
        symbol: item.name,
        depositCoin: item.coinType,
        memoSupport: item.supportsOutputMemos,
        gateFee: Number(item.gateFee),
        gatewayWallet: item.intermediateAccount,
        minAmount: Number(item.gateFee) * 2
    };
};

const getOpenLedgerData = (item) => {
    // console.log('---OL', item);
    return {
        symbol: item.coinType,
        depositCoin: item.walletType,
        memoSupport: item.supportsOutputMemos,
        gateFee: Number(item.gateFee),
        gatewayWallet: item.intermediateAccount,
        minAmount: Number(item.gateFee) * 2
    };
};

const getBlockTradesData = (item) => {
    // console.log('---BlockTrades', item);
    return {
        symbol: item.coinType,
        depositCoin: item.walletType,
        memoSupport: item.supportsOutputMemos,
        gateFee: Number(item.gateFee),
        gatewayWallet: item.intermediateAccount,
        minAmount: Number(item.gateFee) * 2
    };
};

// const getCitadelData = (item) => {
//     const symbol = item.backingCoinType || item.coinType;
//     const inputCoin = symbol;
//     const gateFee = item.gateFee;
//     const memoSupport = item.supportsOutputMemos;
//     const gatewayWallet = item.intermediateAccount;
//     const minAmount = Number(item.gateFee) * 2;
//     return {symbol, memoSupport, gateFee, inputCoin, gatewayWallet, minAmount};
// };

// const getGdexData = (item) => {
//     // console.log('---gdex', item);
//     const symbol = item.coinType;
//     const inputCoin = symbol;
//     const gateFee = item.gateFee;
//     const memoSupport = item.supportsOutputMemos;
//     const gatewayWallet = item.intermediateAccount;
//     const minAmount = Number(item.gateFee) * 2;
//     return {symbol, memoSupport, gateFee, inputCoin, gatewayWallet, minAmount};
// };

const setBridgeData = (type, item, pairs) => {
    // console.log(type)
    const gettersList = {
        'Rudex': getRudexData,
        'Xbtsx': getXbtsxData,
        'Crypto Bridge': getCryptoBridgeData,
        'Open Ledger': getOpenLedgerData,
        'Gdex': getGdex2Data,
        // 'Gdex': getGdexData,
        // 'Citadel': getCitadelData,
        'Block Trades': getBlockTradesData
    };

    const data = gettersList[type] && gettersList[type](item);

    data.withdrawCoin = data.withdrawCoin || pairs[data.depositCoin] || pairs[data.symbol];

    // type === 'Open Ledger' && console.log(data, pairs);

    return data;
};

const getBridges = async () => {
    // const coinsData = {};
    const bridgesData = {};

    await Promise.all(bridgesList.map(async bridge => {
        const {
            BASE,
            COINS_LIST,
            TRADING_PAIRS,
            ACTIVE_WALLETS
        } = bridge.api;

        if (!COINS_LIST) return false;

        const pairs = {};

        let coinsList = await defaultFetch(BASE + COINS_LIST).catch(console.error);

        if (!coinsList || !coinsList.length) return false;

        if (ACTIVE_WALLETS) {
            const walletsList = await defaultFetch(BASE + ACTIVE_WALLETS).catch(console.error);
            coinsList = walletsList.length ? coinsList.filter(data => {
                const param = ['Citadel', 'Crypto Bridge'].includes(bridge.name) ? 'walletType' : 'walletSymbol';
                const item = data[param];
                return item && walletsList.includes(item.toLowerCase());
            }) : [];
        }

        if (TRADING_PAIRS) {
            const pairsList = await defaultFetch(BASE + TRADING_PAIRS).catch(console.error);
            pairsList.length && pairsList.forEach(({
                inputCoinType,
                outputCoinType
            }) => pairs[inputCoinType] = outputCoinType);
        }

        bridgesData[bridge.name] = {
            depositList: [],
            withdrawalList: [],
            coinsList: {}
        };

        const bridgeItem = bridgesData[bridge.name];

        coinsList.forEach(coin => {
            const isGdex = coin.intermediateAccount === "gdex-wallet";
            const depositAllowed = isGdex || coin.depositAllowed || coin.allow_deposit;
            const withdrawalAllowed = isGdex || coin.withdrawalAllowed || coin.allow_withdrawal;
            if (!depositAllowed && !withdrawalAllowed) return;

            if (depositAllowed) bridgeItem.depositList.push(coin.name);
            if (withdrawalAllowed) bridgeItem.withdrawalList.push(coin.name);

            bridgeItem.coinsList[coin.name] = setBridgeData(bridge.name, coin, pairs);
        });

        ['depositList', 'withdrawalList'].forEach(param => {
            bridgeItem[param].sort((prev, next) => prev < next ? -1 : 1);
        });
    }));

    console.log(bridgesData);

    //     coinsList.forEach(coin => {
    //         const isGdex = coin.intermediateAccount === "gdex-wallet";
    //         const depositAllowed = isGdex || coin.depositAllowed || coin.allow_deposit;
    //         const withdrawalAllowed = isGdex || coin.withdrawalAllowed || coin.allow_withdrawal;
    //
    //         if(!depositAllowed && !withdrawalAllowed) return;
    //
    //         // coin.symbol.includes("ANDS") && console.log('--coin', coin, pairs);
    //
    //         // coin.symbol.includes("BTC") && console.log('---coin', bridge.name, coin);
    //
    //         let symbol = coin.symbol;
    //         const names = [coin.symbol];
    //
    //         if(symbol.includes('affiliate_')){
    //             symbol = coin.symbol.split('_')[1];
    //             if(!names.includes(symbol)) names.push(symbol);
    //         }else if(symbol.includes('.')){
    //             symbol = coin.symbol.split('.')[1];
    //             if(!names.includes(symbol)) names.push(symbol);
    //         }
    //
    //         if(names.includes(!coin.name)) names.push(coin.name);
    //
    //         let itemAlreadyCreated = Boolean(coinsData[symbol]);
    //
    //         if(!itemAlreadyCreated) coinsData[symbol] = {
    //             symbol: symbol.toUpperCase(),
    //             names,
    //             deposit: [],
    //             withdraw: [],
    //             bridges: {}
    //         };
    //
    //         const item = coinsData[symbol];
    //
    //         itemAlreadyCreated && names.forEach(newName => !item.names.includes(newName) && item.names.push(newName));
    //
    //         if(depositAllowed) item.deposit.push(bridge.name);
    //         if(withdrawalAllowed) item.withdraw.push(bridge.name);
    //
    //         if(!item.bridges[bridge.name]) item.bridges[bridge.name] = setBridgeData(bridge.name, coin, pairs);
    //     })
    // }));

    return {
        bridgesData,
        lastCheck: new Date().getTime(),
    };
};

export const getGlobalData = async () => {
    const account = getStoragedAccount();
    const defaultAsset = getStorage('settings').defaultAsset;

    let notifications = getStorage('notifications');

    if (!notifications.list) notifications = false;

    let userData = false;
    let sidechainAccounts;

    if (account && account.id) sidechainAccounts = await getSidechainAccounts(account.id);
    if (account.type) userData = await fetchAccountData[account.type](account);

    const globalData = {};

    const opTypes = ChainTypes.operations;
    const globalProps = await dbApi('get_global_properties');
    const lastBlockData = await dbApi('get_objects', [
        ["2.1.0"]
    ]).then(e => e[0]);
    const feesParams = globalProps.parameters.current_fees.parameters;

    globalData.fees = {};
    Object.keys(opTypes).forEach(el => {
        const fee = feesParams.find(fee => fee[0] === opTypes[el]);
        globalData.fees[el] = fee ? fee[1] : {};
    });

    globalData.basicAsset = await new Asset({
        symbol: defaultToken
    }).getDataBySymbol();
    globalData.defaultAsset = await new Asset({
        symbol: defaultQuote
    }).getDataBySymbol();

    return {
        userData,
        globalData,
        notifications,
        lastBlockData,
        sidechainAccounts
    };
};

export const updateAllBlockchainData = async () => {
    const objects = await dbApi('get_objects', [['2.1.0', '2.0.0', '1.3.0', '2.3.0']]);

    let recentBlocks = ChainStore.getRecentBlocks();
    const object210 = objects[0];
    const object200 = objects[1];
    const coreAsset = objects[2];
    const dynamic = objects[3];

    if (!object210 || !object200 || !coreAsset || recentBlocks.size < 1) {
        return null;
    }

    if (coreAsset.dynamic_asset_data_id) {
        let last_irreversible_block_num = object210.last_irreversible_block_num,
            maxHeight = object210.head_block_number,
            updateData = {
                head_block_number: maxHeight,
                last_irreversible_block_num: last_irreversible_block_num,
                recently_missed_count: object210.recently_missed_count,
                time: object210.time,
                current_witness: object210.current_witness,
                active_witnesses: object200.active_witnesses,
                active_committee_members: object200.active_committee_members,
                witness_budget: object210.witness_budget,
                next_maintenance_time: object210.next_maintenance_time,
                block_interval: object200.parameters.block_interval,
                current_supply: dynamic.current_supply,
                confidential_supply: dynamic.confidential_supply,
                coreAsset: coreAsset,
                latestFetchedBlocks: []
            };

        if (recentBlocks) {
            recentBlocks = recentBlocks.toJS().sort((a,b) => a.id > b.id);

            let blockTimes = [],
                previousTime;

            recentBlocks.forEach((block, index) => {
                if (index > 0) {
                    let delta = (previousTime - block.timestamp) / 1000;

                    blockTimes.push([block.id, delta]);
                }

                previousTime = block.timestamp;
            });

            let avgTime = blockTimes.reduce((previous, current, idx, array) => {
                return previous + current[1] / array.length;
            }, 0);

            updateData.avgTime = avgTime;
            updateData.latestBlocks = recentBlocks.map(block => {
                return {
                    blockID: block.id,
                    date: block.timestamp.toLocaleTimeString(),
                    witness: block.witness_account_name,
                    transaction: block.transactions.length
                };
            });

            return updateData;
        } else {
            console.log('Not upd...');
            return null;
        }
    };
}