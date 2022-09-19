import { isEmpty, isEqual, size, xorWith } from "lodash";

export const utils = {

  isNumberKey: (e) => {
    const numbers = "0123456789.";
    if (numbers.includes(e.key)) {
      return true;
    }
    return false;
  },

  roundNum: (num, roundTo = 5) => {
    num = Number(num);
    return Number(num.toFixed(roundTo));
  },


  isArrayEqual: (x, y) => {
    const isSameSize = size(x) === size(y);
    return isSameSize && isEmpty(xorWith(x, y, isEqual));
  }
 
};
