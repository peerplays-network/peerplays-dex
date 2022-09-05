import React from "react";
import {roundNum} from "../../roundNum";
import {formAssetData} from "../../assets";
import {defaultQuote, defaultToken} from "../../../params/networkParams";
import {dbApi} from "../../nodes";
import {MarginsActions} from "../../../components/pages/user/marginsActions";
import IconBarChart from "../../../svg/bar_chart.svg"
import IconCreate from "../../../svg/create.svg";
import IconDelete from "../../../svg/delete.svg";
import {Link} from "react-router-dom";

const tableHead = [
    {
        key: 'asset',
        translateTag: 'asset'
    },
    {
        key: 'balance',
        translateTag: 'balance',
        params: 'align-right fit-content'
    },
    {
        key: 'debt',
        translateTag: 'debt',
        params: 'align-right fit-content'
    },
    {
        key: 'collateral',
        translateTag: 'collateral',
        translateParams: {
            token: defaultToken
        },
        params: 'align-right fit-content'
    },
    {
        key: 'ratio',
        translateTag: 'ratio',
        params: 'align-right fit-content'
    },
    {
        key: 'call',
        translateTag: 'callPrice',
        params: 'align-right fit-content'
    },
    {
        key: 'total',
        translateTag: 'total',
        translateParams: {
            token: defaultQuote
        },
        params: 'align-right fit-content'
    },
    {
        key: 'actions',
        translateTag: '',
        params: 'align-right fit-content'
    }
];

export const getMargins = async (context) => {

    const {call_orders, assets} = context.props.data;

    if(!call_orders.length) return [];

    const rows = await Promise.all(call_orders.map(async order => {
        const {base, quote} = order.call_price;

        const baseAsset = await formAssetData(base);
        const quoteAsset = await formAssetData(quote);

        const baseAmount = baseAsset.setPrecision();
        const debt = quoteAsset.setPrecision();

        const actualBalance = assets.find(el => el.id === quote.asset_id).amount;

        const total = baseAsset.symbol === defaultQuote
            ? baseAmount
            : await dbApi('get_ticker', [baseAsset.symbol, defaultQuote]).then(e => roundNum(baseAmount / e.highest_bid));

        return {
            total,
            debt,
            asset: quoteAsset.symbol,
            balance: quoteAsset.setPrecision(true, actualBalance),
            collateral: baseAsset.setPrecision(true, order.collateral),
            ratio: 0,
            call: roundNum(baseAmount / debt),
            actions: <MarginsActions
                hover={[
                    <Link to={`/exchange/${quoteAsset.symbol}_${baseAsset.symbol}`} key="IconBarChart" className="mask"><IconBarChart/></Link>,
                    <button key="IconCreate" className="mask" onClick={() => console.log('IconCreate')}><IconCreate/></button>,
                    <button key="IconDelete" className="mask" onClick={() => console.log('IconDelete')}><IconDelete/></button>
                ]}
            />
        }
    }));

    return { tableHead, rows }
};