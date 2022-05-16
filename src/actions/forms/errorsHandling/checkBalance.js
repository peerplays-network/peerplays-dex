import {getAccountData} from "../../store";

export const checkAmountToSell = ({type, buyAsset, sellAsset, amount_to_receive, amount_to_sell}) => {
  if(!amount_to_sell) {
    return 'required';
  } else {
      if(isNaN(amount_to_sell)){
        return 'isNan';
      }

      if(amount_to_sell <= 0) {
        return 'isZero';
      }

      if(type === "buy" ||type === undefined){

        const userAsset = getAccountData().assets.find(el => el.symbol === sellAsset);
        if(!userAsset) {
          return 'isNotEnough'
        } else {
          return userAsset.setPrecision() < amount_to_sell ? 'isNotEnough' : false;
        }
      }
      return false; 
    }
}

export const checkAmountToReceive = async ({type, buyAsset, sellAsset, amount_to_sell, amount_to_receive}) => {
  if(!amount_to_receive) {
    return 'required';
  } else {
    if(isNaN(amount_to_receive)){
      return 'isNan';
    }
    if(amount_to_receive <= 0) {
      return 'isZero';
    }
    if(type === 'sell') {
      const userAsset = getAccountData().assets.find(el => el.symbol === buyAsset);
      if(!userAsset) {
        return 'isNotEnough'
      } else {
        return userAsset.setPrecision() >= amount_to_receive ? false : 'isNotEnough';
      }
    }
    if(amount_to_receive >= 10 ** 8)
      return 'isTooBig'
    return false;
  }
}

export const checkPrice = ({price}) => {
  if(!price) {
    return 'required';
  } else {
    if(isNaN(price)){
      return 'isNan';
    }
    if (price >= 10 ** 8)
      return 'isTooBig'
    return false;
  }
}