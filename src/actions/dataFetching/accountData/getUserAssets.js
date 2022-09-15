import React from 'react';
import {roundNum} from "../../roundNum";
import {formAssetData} from "../../assets";
import {dispatchSendModal} from "../../forms/dispatchSendModal";
import {defaultToken} from "../../../params/networkParams";
import {dbApi} from "../../nodes";
import { IconSend} from "../../../svg";
import {getAccountData} from "../../store";

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
        key: 'quoteAsset',
        translateTag: 'quote_asset',
        params: 'align-right fit-content'

    },
    {
        key: 'latest',
        translateTag: 'priceWithToken',
        params: 'align-right fit-content'
    },
    {
        key: 'change',
        translateTag: 'change',
        params: 'fit-content'
    },
    {
        key: 'volume',
        translateTag: 'volume',
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

        let latest = 0, percent_change = 0, volume = 0;

        if(symbol !== defaultToken) {
            try{
                const tickerData = await dbApi('get_ticker', [symbol, defaultToken]);
                if(tickerData) {
                    latest= roundNum(tickerData.latest, asset.precision);
                    percent_change = tickerData.percent_change;
                    volume = roundNum(tickerData.quote_volume, 3)
                } 
            } catch(e){}
        }

        const change = !percent_change || percent_change == 0 ? `0%` : percent_change > 0 ? `+${percent_change}%` : `${percent_change}%`;

        const actions = userLogged && formActions(symbol, name, isActiveUser);

        return{ symbol, available, latest, change, volume, actions, quoteAsset: defaultToken };
    }));

    return { tableHead, rows, isActiveUser };
};