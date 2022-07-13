import React from "react";
import {dbApi} from "../../nodes";
import {formAssetData, setPrecision} from "../../assets";
import {openWarning} from "../../openWarning";
import {formDate} from "../../formDate";
import {IconDelete} from "../../../svg";
import {roundNum} from "../../roundNum";

export const getUserOrders = async (pair, account) => {
    const {base, quote} = pair;

    const baseID = base.id;
    const quoteID = quote.id;
    const basePrecision = base.precision;
    const quotePrecision = quote.precision;

    if(!account) return false;

    const tableHead = [
        {
            key: 'expiration',
            translateTag: 'expiration'
        },
        {
            key: 'quote',
            translateTag: 'param',
            translateParams: {
                param: quote.symbol
            },
            params: 'align-right'
        },
        {
            key: 'base',
            translateTag: 'param',
            translateParams: {
                param: base.symbol
            },
            params: 'align-right'
        },
        {
            key: 'price',
            translateTag: 'price',
            params: 'align-right'
        },
        {
            key: 'action',
            translateTag: 'kill',
            params: 'fit-content--center clr--negative'
        }
    ];

    return dbApi('get_full_accounts', [[account], false])
        .then(e => e[0][1].limit_orders.filter(e => {
            const prices = e.sell_price;
            const orderAssets = [prices.base.asset_id, prices.quote.asset_id];
            return orderAssets.includes(baseID) && orderAssets.includes(quoteID);
        }))
        .then(async orders => {

            if(!orders.length) return false;

            const rows = await Promise.all(orders.map(async order => {
                const expiration = formDate(order.expiration, ['date', 'month', 'year', 'time']);

                const baseAsset = await formAssetData(order.sell_price.base);
                const quoteAsset = await formAssetData(order.sell_price.quote);

                const orderVal = baseAsset.setPrecision(false, order.for_sale);

                let price = 0,
                    base = 0,
                    quote = 0;

                if(baseID === baseAsset.id){
                    base = orderVal;
                    price = baseAsset.calculatePrice(quoteAsset);
                    quote = roundNum(base / price);
                } else {
                    quote = orderVal;
                    price = quoteAsset.calculatePrice(baseAsset);
                    base = roundNum(price * quote);
                }

                const action = <button className="actions__btn" onClick={() => openWarning('limit_order_cancel', order.id)}>
                        <IconDelete />
                    </button>;

                return { expiration, base, quote, price, action }
            }));

            return {rows, tableHead};
        })

};