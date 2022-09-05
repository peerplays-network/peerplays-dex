import React from "react";
import ActionsBtn from "../helpers/actionsBtn";
import IconBuy from "../../svg/buy.svg";
import IconDeposit from "../../svg/deposit.svg";
import IconSend from "../../svg/send.svg";
import Table from "../helpers/table";
import {connect} from "react-redux";
import {defaultQuote, defaultToken} from "../../params/networkParams";

const tableHead = [
    {
        key: 'asset',
        translateTag: 'asset'
    },
    {
        key: 'available',
        translateTag: 'available',
        params: 'align-right fit-content'
    },
    {
        key: 'price',
        translateTag: 'priceUSD',
        translateParams: {
            token: defaultQuote
        },
        params: 'align-right fit-content'
    },
    {
        key: 'change',
        translateTag: 'change',
    },
    {
        key: 'value',
        translateTag: 'valueUSD',
        translateParams: {
            token: defaultQuote
        },
        params: 'align-right'
    },
    {
        key: 'actions',
        translateTag: 'actions',
        params: 'align-right actions actions--long'
    }
];
const formAssets = arr => arr.map(el => ({
    asset: el.symbol,
    available: el.quantity / (10 ** el.precision),
    price: el.usdPrice,
    change: el.dailyChange === "0" ? el.dailyChange : el.dailyChange > 0 ? `+${el.dailyChange}` : `-${el.dailyChange}`,
    value: Number((el.quantity / (10 ** el.precision) * el.usdPrice).toFixed(5)),
    actions: <div className="actions__wrapper">
        <div className="actions__on-hover">
            <button><IconSend /></button>
            <button><IconBuy /></button>
            <button><IconDeposit /></button>
        </div>
        <ActionsBtn
            actionsList={[
                <button>Reset Settings</button>,
                <button>Body 2</button>,
                <button>Body 2</button>
            ]}
        />
    </div>
}));

const UserAssets = ({assets}) => {

    if(!assets) return <span>No assets</span>;

    const newAssets = formAssets(assets);

    return (
        <Table
            tableHead={tableHead}
            rows={newAssets}
            link={{ 
                path: '/asset/',
                key: 'asset'
            }}
        />
    );
};

const mapStateToProps = (state) => ({assets: state.account.assets});

export default connect(mapStateToProps)(UserAssets);