import {TransactionHelper} from "peerplaysjs-lib";
import {getAccountData, getBasicAsset, getFees, getStore} from "../store";
import {Asset} from "../../classes";

const defaultNonce = TransactionHelper.unique_nonce_uint64();

const calculateFee = (type, errVariable, quantity, assetName, memo) => {
    const val = Number(quantity);

    const result = {
        feeErr: '',
        feeAmount: 0,
        errVariable
    };

    if(!val){
        return result;
    } else if(isNaN(val)){
        result.feeErr = 'isNan';
        return result;
    } else if(Number(val) <= 0){
        result.feeErr = 'isZero';
        return result;
    }

    const storeData = getStore();
    const {basicAsset, fees} = storeData.globalData;
    const account = storeData.accountData;
    const usersBasicAsset = account.assets.find(e => e.symbol === basicAsset.symbol);

    if(!usersBasicAsset || !usersBasicAsset.amount){
        result.feeErr = 'isEmptyBalance';
        return result;
    }

    const isBasicAsset = assetName === basicAsset.symbol;
    if(!isBasicAsset){
        const currentAsset = account.assets.find(e => e.symbol === assetName)
        if(!currentAsset || !currentAsset.amount){
            result.feeErr = 'isNotEnough';
            return result;
        }
        if(currentAsset.setPrecision() < val){
            result.feeErr = 'isNotEnough';
            return result;
        }
    }

    let feeData = fees[type];
    if (!feeData.fee) feeData = {fee: 100};

    const rawFee = feeData.fee;

    let feeAmount = basicAsset.setPrecision(false, rawFee);

    if(memo && memo.length > 0){
        const rawAdditional = feeData.price_per_kbyte;
        const memoLength = JSON.stringify(account.keys.memo).length;
        const helperLength = JSON.stringify(defaultNonce).length;
        const result = (memoLength + helperLength + memo.length) / 1024 * basicAsset.setPrecision(false, rawAdditional);

        feeAmount = feeAmount + result;
    }

    result.feeAmount = feeAmount;
    const amountToPay = isBasicAsset ? feeAmount + val : feeAmount;
    if(usersBasicAsset.setPrecision() < amountToPay) result.feeErr = 'isNotEnough';

    return result;
};

const calculateLimitOrderFee = (orderType = 'buy', amount_to_sell, sellAsset, amount_to_receive, buyAsset) => {
    const val = amount_to_sell==''?'': Number(amount_to_sell);
    const val2 = amount_to_receive == undefined ?'': Number(amount_to_receive)
    const result = {
        feeErr: '',
        feeAmount: 0,
        errVariable: 'amount_to_sell'
    };
    const result2 = {
        feeErr: '',
        feeAmount: 0,
        errVariable: 'amount_to_receive'
    };
    if(!val){
        return result;
    } else if(isNaN(val)){
        result.feeErr = 'isNan';
        return result;
    } else if(Number(val) <= 0){
        result.feeErr = 'isZero';
        return result;
    }

    if(!val2 && val2 != ""){
        return result2;
    } else if(isNaN(val2)){
        result2.feeErr = 'isNan';
        return result2;
    } else if(Number(val2) <= 0 && val2 !=""){
        result2.feeErr = 'isZero';
     return result2;
    }

    const storeData = getStore();
    const {basicAsset, fees} = storeData.globalData;
    const account = storeData.accountData;
    const usersBasicAsset = account.assets.find(e => e.symbol === basicAsset.symbol);

    if(!usersBasicAsset || !usersBasicAsset.amount){
        result.feeErr = 'isEmptyBalance';
        return result;
    }

    const isBasicAsset = sellAsset === basicAsset.symbol;
    const isBasicBuyAsset = buyAsset === basicAsset.symbol;

    let feeData = fees['limit_order_create'];
    if (!feeData.fee) feeData = {fee: 100};

    const rawFee = feeData.fee;
    
    let feeAmount = basicAsset.setPrecision(false, rawFee);
    
    result.feeAmount = feeAmount;
    let amountToPay;
    if(isBasicAsset) {
        if (orderType === 'buy') {
            amountToPay = feeAmount + val;
        } else if (orderType === 'sell') {
            amountToPay = feeAmount;
        }
    } else {
        if (isBasicBuyAsset) {
            if (orderType === 'buy') {
                amountToPay = feeAmount;
            } else if (orderType === 'sell') {
                amountToPay = feeAmount + val2;
            }
        } else {
            amountToPay = feeAmount;
        }
    }
    if(usersBasicAsset.setPrecision() < amountToPay) result.feeErr = 'isNotEnough';
   
    return result;
}
const calculateWithdrawFee = data => {
    const result = {
        feeErr: '',
        feeAmount: getBasicAsset(),
        errVariable: 'withdrawAmount'
    };

    let val = data.withdrawAmount;

    if(!val){
        return result;
    } else if(isNaN(val)){
        result.feeErr = 'isNan';
        return result;
    } else if(Number(val) <= 0){
        result.feeErr = 'isNull';
        return result;
    }

    val = Number(val);

    const userData = getAccountData();
    const basicAsset = getBasicAsset();
    const userCurrentAsset = userData.assets.find(el => el.symbol.toUpperCase() === data.symbol);

    if(!userCurrentAsset || userCurrentAsset.setPrecision() < data.minAmount){
        result.feeErr = 'isNotEnough';
        return result;
    }

    if(data.withdrawAmount < data.minAmount){
        result.feeErr = 'belowMinAmount';
        return result;
    }

    const userBasicAsset = userData.assets.find(el => el.symbol === basicAsset.symbol);
    const basicAssetAmount  = userBasicAsset ? userBasicAsset.toPrecision() : 0;

    if(!userBasicAsset || userBasicAsset.setPrecision() <= 0){
        result.feeErr = 'isNotEnough';
        return result;
    }

    const fees = getFees().transfer;

    const defaultFee = basicAsset.setPrecision(true, fees.fee);

    const memo = `${data.withdrawAddress}\n${data.memo ? data.memo : ''}`;
    const memoLength = JSON.stringify(memo).length;
    const helperLength = JSON.stringify(defaultNonce).length;
    const memoCost = (memoLength + helperLength + memo.length) / 1024 * basicAsset.setPrecision(true, fees.price_per_kbyte);

    result.feeAmount = new Asset({...basicAsset, amount: defaultFee + memoCost});

    if(basicAssetAmount < result.feeAmount.toPrecision() + val){
        result.feeErr = 'isNotEnough';
    }

    return result;
};

const calculateSidechainAddressAddFee = () => {
  const result = {
      feeErr: '',
      feeAmount: getBasicAsset(),
      errVariable: 'withdrawAddress'
  };

  const userData = getAccountData();
  const basicAsset = getBasicAsset();

  const userBasicAsset = userData.assets.find(el => el.symbol === basicAsset.symbol);

  const fees = getFees().sidechain_address_add;
  if(fees && fees.fee > 0 && (!userBasicAsset || userBasicAsset.setPrecision() <= fees.fee)){
      result.feeErr = 'isNotEnough';
      const defaultFee = basicAsset.setPrecision(true, fees.fee);

  result.feeAmount = new Asset({...basicAsset, amount: defaultFee});
    return result;

  }

  

  return result;
};

export const feeCalculator = {
    transfer: ({quantity, quantityAsset, memo}) => calculateFee('transfer', 'quantity', quantity, quantityAsset, memo),
    limit_order_create: ({type, amount_to_sell, sellAsset, amount_to_receive, buyAsset}) => calculateLimitOrderFee(type, amount_to_sell, sellAsset, amount_to_receive, buyAsset),
    withdraw_trx: data => calculateWithdrawFee(data),
    asset_fund_fee_pool: ({quantity, quantityAsset}) => calculateFee('asset_fund_fee_pool', 'quantity', quantity, quantityAsset),
    asset_claim_pool: ({quantityClaim, quantityAsset}) => calculateFee('asset_claim_pool', 'quantity', quantityClaim, quantityAsset),
    asset_claim_fees: ({quantityAssetFees, quantityAsset}) => calculateFee('asset_claim_fees', 'quantity', quantityAssetFees, quantityAsset),
    asset_issue: ({issueAmount, assetSymbol, memo}) => calculateFee('asset_issue', 'issueAmount', issueAmount, assetSymbol, memo),
    sidechain_address_add: calculateSidechainAddressAddFee
};
