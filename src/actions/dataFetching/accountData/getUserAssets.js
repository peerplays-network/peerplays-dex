import React from 'react';
import {roundNum} from "../../roundNum";
import {formAssetData} from "../../assets";
import {dispatchSendModal} from "../../forms/dispatchSendModal";
import {defaultQuote} from "../../../params/networkParams";
import {dbApi} from "../../nodes";
import {IconBuy, IconDeposit, IconSend} from "../../../svg";
import {getAccountData} from "../../store";
import {setModal} from "../../../dispatch";
import WithdrawModal from "../../../components/helpers/modal/content/withdrawModal";
import {getPassword} from "../../forms";

const basicTableHead = [
    {
        key: 'symbol',
        translateTag: 'asset'
    },
    {
        key: 'available',
        translateTag: 'available',
        params: 'align-right fit-content'
    },
    {
        key: 'latest',
        translateTag: 'priceWithToken',
        translateParams: {
            token: defaultQuote
        },
        params: 'align-right fit-content'
    },
    {
        key: 'change',
        translateTag: 'change',
        params: 'fit-content'
    },
    {
        key: 'value',
        translateTag: 'volume',
        translateParams: {
            token: defaultQuote
        },
        params: 'align-right fit-content'
    },
    {
        key: 'actions',
        translateTag: 'actions',
        params: 'align-right actions actions--long'
    }
];

const formActions = (asset, name, activeUser) => {

    let additionalActions = '';

    if(activeUser){
        additionalActions =
            <div className="actions__on-hover">
                <button onClick={() => dispatchSendModal(asset)}>
                    <IconSend />
                </button>
                <button>
                    {/* <IconDeposit onClick={() => getPassword(password => setModal(<WithdrawModal asset={asset} password={password} />))} /> */}
                </button>
            </div>;
    } else {
        additionalActions =
            <div className="actions__on-hover">
                <button onClick={() => dispatchSendModal(asset, name)}>
                    <IconSend />
                </button>
            </div>
    }

    return(
        <div className="actions__wrapper">
            {additionalActions}
        </div>
    );
};

export const getUserAssets = async (context) => {

    /* Let's check our user:
        - if he hasn't logged, we remove actions from table;
        - if name doesn't match active account, then inside map we create class Asset for every element;
     */

    const {name, assets} = context.props.data;

    if(!assets || !assets.length) return [];

    const userLogged = getAccountData().name;
    const isActiveUser = userLogged && userLogged === name;
    const tableHead = userLogged ? basicTableHead : basicTableHead.slice(0, basicTableHead.length - 1);

    // And now we form asset data for table

    const rows = await Promise.all(assets.map(async el => {
        const asset = isActiveUser ? el : await formAssetData(el);

        const symbol = asset.symbol;
        const available = asset.setPrecision();
        const defaultQuoteAsset = await formAssetData({symbol: defaultQuote})

        let latest = 0, percent_change = 0, value = 0;

        if(symbol !== defaultQuote) {
            try{
                const tickerData = await dbApi('get_ticker', [symbol, defaultQuote]);
                if(tickerData) {
                    latest= roundNum(tickerData.latest, defaultQuoteAsset.precision);
                    percent_change = tickerData.percent_change;
                    value = roundNum(tickerData.quote_volume, 3)
                } 
            } catch(e){}
        }

        const change = !percent_change || percent_change == 0 ? `0%` : percent_change > 0 ? `+${percent_change}%` : `-${percent_change}%`;

        const actions = userLogged && formActions(symbol, name, isActiveUser);

        return{ symbol, available, latest, change, value, actions };
    }));

    return { tableHead, rows, isActiveUser };
};