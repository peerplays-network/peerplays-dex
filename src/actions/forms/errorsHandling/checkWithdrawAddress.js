const validateOLAddress = ({baseApiUrl, inputCoin, withdrawAddress}) => fetch(`${baseApiUrl}/wallets/${inputCoin}/address-validator?${withdrawAddress}`).then(e => e.json()).then(e => e.isValid && e.isAccount);
const validateCryptoBridgeAddress = ({baseApiUrl, symbol, withdrawAddress}) => fetch(`https://api.crypto-bridge.org/api/v2/accounts/${withdrawAddress}/assets/${symbol.toUpperCase()}/addresses/validate`);

const validateRudexAddress = ({baseApiUrl, symbol, withdrawAddress}) => {
    const url = `${baseApiUrl}/wallets/${symbol}/check-address`;
    const params = {method: "POST", body: JSON.stringify({address: withdrawAddress}), headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }};
    return fetch(url, params).then(e => e.json()).then(e => e.isValid);
};

const validateXbtsxAddress = ({baseApiUrl, inputCoin, withdrawAddress}) => {
    const url = `${baseApiUrl}/wallets/${inputCoin}/check-address`;
    const params = {method: "POST", body: JSON.stringify({address: withdrawAddress}), headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }};
    return fetch(url, params).then(e => e.json()).then(e => e.isValid);
};

const validateGdexAddress = ({baseApiUrl, symbol, withdrawAddress}) => {
    const body = {
        address: withdrawAddress,
        assetName: symbol.toUpperCase(),
        version: "1.0"
    };
    const url = `${baseApiUrl}/gateway/address/checkAddress`;
    const params = {method: "POST", body: JSON.stringify(body), headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }};
    return fetch(url, params).then(e => e.json()).then(e => e.isValid);
};

const addressValidation = {
    'Open Ledger': validateOLAddress,
    'Rudex': validateRudexAddress,
    'Xbtsx': validateXbtsxAddress,
    'Gdex 2': validateGdexAddress,
    // 'Crypto Bridge': validateCryptoBridgeAddress,
};

export const checkWithdrawAddress = async data => {
    if(data.withdrawAddress.match(/^  *$/) !== null) return 'required'
    if(data.length < 44) return 'invalidKey'
    if(!data.withdrawAddress) return false;
    return addressValidation[data.bridgeName] ? addressValidation[data.bridgeName](data).then(valid => !valid ? 'addressIsNotValid' : false) : false;
};
