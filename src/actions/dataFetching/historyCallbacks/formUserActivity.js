import React from "react";
import {ChainTypes} from "peerplaysjs-lib";
import {getUserName} from "../../account/getUserName";
import {formAssetData, getAssetById} from "../../assets";
import {dbApi} from "../../nodes";
import {Link} from "react-router-dom";
import {formDate} from "../../formDate";
import Translate from "react-translate-component";
import TransactionModal from "../../../components/helpers/modal/content/transanctionModal";
import {setModal} from "../../../dispatch";
import {getBasicAsset} from "../../store";
import { getPassword } from "../../forms";

export const formUserActivity = async (context) => {
    const user = context.props.data.id;
    let history = context.props.data.history;
  
    if (!history || !history.length) return [];
    history = history.filter(el => el.op[0] >= 0 && el.op[0] <= 8 || el.op[0] === 32 || el.op[0] === 33 || el.op[0] === 34 || el.op[0] === 10 || el.op[0] === 11 || el.op[0] === 13 || el.op[0] === 14 || el.op[0] === 16);
    

    return Promise.all(history.map(async el => {
      const fee = el.op[1].fee;

      const time = await dbApi('get_block_header', [el.block_num]).then(block => formDate(block.timestamp, ['date', 'month', 'year', 'time']));
      const {type, info} = await formInfoColumn(user, el);
      const feeAsset = await formAssetData(fee);

      return {
          id: el.id,
          fee: feeAsset.toString(),
          type,
          info,
          time
      };
    }));
};
const handleTransactionClick = async (user, operation) => {     
    if(Object.keys(operation.op[1]).includes("memo") && operation.op[1].memo.message.slice(0, 8) !== "00000000") {
        getPassword((password, keyType) => {
            setModal(<TransactionModal user={user} operation={operation} password={password} keyType={keyType}/>)
        }, "memo");
    } else {
        setModal(<TransactionModal user={user}  operation={operation}/>)
    }
}

const formInfoColumn = async (user, operation) => {
    const {type, data} = await formTrxInfo(user, operation);
    const basicTag = `tableInfo.${type}`;
    return {
        type: <Translate content={`${basicTag}.title`} component="a"
            onClick={() => handleTransactionClick(user, operation)}
            className="operation positive" />,
        info: <Translate content={`${basicTag}.description`} with={data} />
    };
};

export const formTrxInfo = async (user, operation, notification = false) => {
    const operationsNames = Object.keys(ChainTypes.operations);

    let type = operationsNames[operation.op[0]].toLowerCase();

    const opData = operation.op[1];
    const opResult = operation.result[1];

    if (!formAdditionalInfo[type]) return '';

    const data = await formAdditionalInfo[type](notification, opData, opResult);

    if (type === 'transfer') type = opData.from === user ? 'send' : 'receive';

    return {type, data}
};

const formAdditionalInfo = {
    'account_create': async (notification, {registrar, name}) => ({
        author: await getAuthor(registrar),
        registrar: await formUserLink(registrar, notification),
        user: await formUserLink(name, notification)
    }),
    'vesting_balance_create': async (notification, {creator, amount}) => {
        const amountAsset = await formAssetData(amount);
        return ({
            user: await formUserLink(creator, notification),
            quantity: amountAsset.toString()
        })
    },
    'vesting_balance_withdraw': async (notification, {owner, amount}) => {
        const amountAsset = await formAssetData(amount);
        return ({
            user: await formUserLink(owner, notification),
            quantity: amountAsset.toString()
        })
    },
    'account_upgrade': async (notification, {account_to_upgrade}) => ({
        user: await formUserLink(account_to_upgrade, notification)
    }),
    'worker_create': async (notification, {owner, daily_pay}) => ({
        user: await formUserLink(owner, notification),
        dailyPay: getBasicAsset().toString(daily_pay)
    }),
    'account_update': async (notification, {account}) => ({
        author: await getAuthor(account),
        user: await formUserLink(account, notification)
    }),
    'transfer': async (notification, {from, to, amount}) => {

        const amountAsset = await formAssetData(amount);

        return {
            author: await getAuthor(from),
            sender: await formUserLink(from, notification),
            receiver: await formUserLink(to, notification),
            quantity: amountAsset.toString()
        };
    },
    'limit_order_cancel': async (notification, {fee_paying_account, order}) => ({
        id: order.split('.')[2],
        author: await getAuthor(fee_paying_account),
        user: await formUserLink(fee_paying_account, notification),
    }),
    'limit_order_create': async (notification, {seller, min_to_receive, amount_to_sell}, id) => {

        const buyAsset = await formAssetData(min_to_receive);
        const sellAsset = await formAssetData(amount_to_sell);

        return {
            id: id.split('.')[2],
            author: await getAuthor(seller),
            creator: await formUserLink(seller, notification),
            buy: buyAsset.toString(),
            sell: sellAsset.toString(),
            marketLink: formLink('exchange', `market`, `${buyAsset.symbol}_${sellAsset.symbol}`)
        };
    },
    "fill_order": async (notification, {receives, pays, order_id, account_id}) => {

        const buyAsset = await formAssetData(receives);
        const sellAsset = await formAssetData(pays);

        return {
            author: await getAuthor(account_id),
            id: order_id.split('.')[2],
            user: await formUserLink(account_id, notification),
            pays: buyAsset.toString(),
            receives: sellAsset.toString(),
            marketLink: notification ? 'market' : formLink('exchange', `market`, `${buyAsset.symbol}_${sellAsset.symbol}`)
        }
    },
    "asset_fund_fee_pool": async (notification, {from_account, asset_id, amount}) => {
        const basicAsset = getBasicAsset();
        const asset = await formAssetData({asset_id: basicAsset.id, amount});
        const feePoolAsset = await getAssetById(asset_id)
        return {
            from: await formUserLink(from_account, notification),
            symbol: feePoolAsset.symbol,
            amount: asset.toString()
        }
    },
    "account_whitelist": async (notification, {account_to_list, authorizing_account, new_listing}) => {
        const statuses = {
            0: 'unlisted',
            1: 'whitelisted',
            2: 'blacklisted'
        };

        return{
            issuer: await formUserLink(account_to_list, notification),
            listed: await formUserLink(authorizing_account, notification),
            status: statuses[new_listing]
        }
    },
    "asset_create": async (notification, {symbol, issuer}) => ({
        issuer: await formUserLink(issuer, notification),
        assetName: notification ? symbol : formLink('asset', symbol),
    }),
    "asset_issue": async (notification, {asset_to_issue, issue_to_account, issuer}) => {
        const asset = await formAssetData(asset_to_issue);

        return{
            issuer: await formUserLink(issuer, notification),
            receiver: await formUserLink(issue_to_account, notification),
            assetAmount: asset.toString()
        }
    },
    "asset_update": async (notification, {issuer, asset_to_update}) => ({
        issuer: await formUserLink(issuer, notification),
        asset: await formAssetLink(asset_to_update, notification),
    }),
    "asset_claim_pool": async (notification, {amount_to_claim, asset_id, issuer}) => {
        const claimedAsset = await formAssetData(amount_to_claim);

        return{
            issuer: await formUserLink(issuer, notification),
            asset: await formAssetLink(asset_id, notification),
            claimed: claimedAsset.toString()
        }
    },
    "asset_update_issuer": async (notification, {new_issuer, asset_to_update, issuer}) => ({
        issuer: await formUserLink(issuer, notification),
        asset: await formAssetLink(asset_to_update, notification),
        newOwner: await formUserLink(new_issuer, notification)
    }),
    "asset_update_feed_producers": async (notification, {asset_to_update, issuer}) => ({
        issuer: await formUserLink(issuer, notification),
        asset: await formAssetLink(asset_to_update, notification)
    })
};

const getAuthor = userID => getUserName(userID);
const formLink = (url, text, linkID) => <Link to={`/${url}/${linkID || text}`}>{text}</Link>;
const formAssetLink = async (assetID, notification) => {
    const asset = await formAssetData({id: assetID});
    return notification ? asset.symbol : formLink('asset', asset.symbol);
};
const formUserLink = async (userID, notification) => {
    const userName = await getUserName(userID);
    return notification ? userName : formLink('user', userName);
};