import {checkNewLogin} from "./checkNewLogin";
import {checkNewWorker} from "./checkNewWorker";
import {checkBeginDate, checkEndDate} from "./checkDates";
import {checkNumber} from "./checkNumber";
import {checkPassword} from "./checkPassword";
import {checkConfirmPassword} from "./checkPassword";
import {checkLogin} from "./checkLogin";
import {checkBrainkey} from "./checkBrainkey";
import {checkWithdrawAddress} from "./checkWithdrawAddress";
import {checkNewAssetName} from "./checkNewAssetName";
import {checkIssueAmount} from "./checkIssueAmount";
import {checkDecimal} from "./checkDecimal";
import {checkCondition} from "./checkCondition";
import {checkBackingAsset} from "./checkBackingAsset";
import {checkAmountToSell, checkAmountToReceive,checkPrice} from './checkBalance';
import {checkQuantity} from './checkQuantity';
import { checkTo } from "./checkTo";
import { checkDepositPublicKey } from "./checkDepositPublicKey";
import { checkWithdrawPublicKey } from "./checkWithdrawPublicKey";
import { checkReferrer } from "./checkReferrer";
import { checkAssetsForExchange } from "./checkAssetsForExchange";

export const errorsChecker = {
    newLogin: checkNewLogin,
    login: checkLogin,
    to: checkTo,
    password: checkPassword,
    passwordCheck: checkConfirmPassword,
    referrer: checkReferrer,
    newWorkerName: checkNewWorker,
    dateBegin: checkBeginDate,
    dateEnd: checkEndDate,
    dailyPay: checkNumber,
    vesting: checkNumber,
    brainkey: checkBrainkey,
    withdrawAddress: checkWithdrawAddress,
    newAssetName: checkNewAssetName,
    issueAmount: checkIssueAmount,
    decimal: checkDecimal,
    condition: checkCondition,
    backingAsset: checkBackingAsset,
    amount_to_sell: checkAmountToSell,
    amount_to_receive: checkAmountToReceive,
    price:checkPrice,
    quantity: checkQuantity,
    depositPublicKey: checkDepositPublicKey,
    withdrawPublicKey: checkWithdrawPublicKey,
    sellAsset: checkAssetsForExchange,
    buyAsset: checkAssetsForExchange,
};
