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
  }
  
};
