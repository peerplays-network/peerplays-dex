import React from "react";
import {roundNum} from "../../roundNum";
import {openWarning} from "../../openWarning";
import {formAssetData} from "../../assets";
import {defaultToken} from "../../../params/networkParams";
import {dbApi} from "../../nodes";
import ActionsBtn from "../../../components/helpers/buttons/actionsBtn";
import {getAccountData} from "../../store";
import counterpart from "counterpart";


const defaultTableHead = [
    {
        key: 'trade',
        translateTag: 'trade'
    },
    {
        key: 'order',
        translateTag: 'orderID',
        params: 'fit-content align-right'
    },
    {
        key: 'description',
        translateTag: 'description',
        params: 'fit-content align-right'
    },
    {
        key: 'price',
        translateTag: 'price',
        params: 'fit-content align-right'
    },
    {
        key: 'market',
        translateTag: 'marketPrice',
        params: 'fit-content align-right'
    },
    {
        key: 'value',
        translateTag: 'value',
        params: 'fit-content align-right'
    },
    {
        key: 'actions',
        params: 'actions fit-content align-right'
    }
];

export const getOrders = async (context) => {

    const {name, limit_orders} = context.props.data;

    if(!limit_orders || !limit_orders.length) return [];

    const isActiveUser = name === getAccountData().name;

    const tableHead = isActiveUser ? defaultTableHead : defaultTableHead.slice(0, defaultTableHead.length - 1);

    const rows = await Promise.all(limit_orders.map(async el => {

        const {base, quote} = el.sell_price;
        const baseAsset = await formAssetData(base);
        const quoteAsset = await formAssetData(quote);
        const marketPrice = await dbApi('get_ticker', [baseAsset.symbol, quoteAsset.symbol]).then(e => e.latest);
        const forSale = await formAssetData({...baseAsset, amount: el.for_sale });
        const price = baseAsset.calculatePrice(quoteAsset);
        const quoteAmount = roundNum(forSale.setPrecision() / price);

        let value = 1;

        if(baseAsset.symbol !== defaultToken){
            value = await dbApi('get_ticker', [baseAsset.symbol, defaultToken]).then(e => e.latest);
        }

        const actions = isActiveUser
            ? <div className="actions__wrapper">
                <ActionsBtn
                    actionsList={[
                        <button onClick={() => openWarning('limit_order_cancel', el.id)}>
                            <span>{counterpart.translate(`tableInfo.limit_order_cancel.title`)}</span>
                        </button>
                    ]}
                    className="cancel__button"
                />
            </div>
            : false;

        return {
            trade: baseAsset.symbol,
            order: el.id.substr(el.id.lastIndexOf('.') + 1, ),
            description: `Buy ${quoteAsset.toString()} for ${forSale.toString()}`,
            price: `${price} ${baseAsset.symbol}`,
            market: marketPrice > 0 ? `${roundNum(marketPrice)} ${quoteAsset.symbol}` : 'N/A',
            value: `${forSale.toString()}`,
            actions
        }
    }));

    return { tableHead, rows }
};