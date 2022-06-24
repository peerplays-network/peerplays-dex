import React from "react";
import {getPassword} from "./forms/index";
import WarningModal from "../components/helpers/modal/content/warningModal";
import {setModal} from "../dispatch/layoutDispatch";
import {getAccountData, getGlobals} from "./store";
import {Asset} from "../classes";

export const openWarning = async (trxType, additionalData) => getPassword(async (password, keyType) => {
    const {fees, basicAsset} = getGlobals();
    const accountData = getAccountData();
    const rawFee = fees[trxType].fee || fees[trxType].membership_lifetime_fee;

    const feeAsset = new Asset({...basicAsset, amount: rawFee});
    const params = formWarningTrx[trxType](accountData, additionalData);

    let error = false;

    if(rawFee > 0){
        const userAsset = getAccountData().assets.find(el => el.symbol === feeAsset.symbol);
        userAsset && userAsset.setPrecision() < feeAsset.setPrecision() ? error = 'isNotEnough' : '';
    }

    params.fee = {amount: 0, asset_id: feeAsset.id};

    const trx = { type: trxType, params };

    setModal(<WarningModal trx={trx} error={error} password={password} keyType={keyType} fee={feeAsset.toString()} />)
}, 'active');

const setCancelOrder = (accountData, order) => ({
    fee_paying_account: accountData.id,
    order
});

const setUpgrade = (accountData) => ({
    account_to_upgrade: accountData.id,
    upgrade_to_lifetime_member: true,
});

const formWarningTrx = {
    limit_order_cancel: setCancelOrder,
    account_upgrade: setUpgrade,
};

