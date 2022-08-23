import React from "react";
import {connect} from "react-redux";
import Translate from "react-translate-component";

const UserBalance = ({assetSymbol, account}) => {

    let balance = 0;

    if(account){
        const asset = account.assets.find(el => el.symbol === assetSymbol);
        balance = asset ? asset.setPrecision() : 0;
    }

    return (
        <div className="exchange-form__info">
            <Translate content="exchange.balance" />
            <span>{balance} {assetSymbol}</span>
        </div>
    )
};

const mapStateToProps = state => ({account: state.accountData});

export default connect(mapStateToProps)(UserBalance);