import { validate } from 'bitcoin-address-validation'
import { testnetCheck } from '../../../params/networkParams';

export const checkWithdrawAddress = async data => {

    if(!data.withdrawAddress) return 'required';
    if(data.withdrawAddress.match(/^  *$/) !== null) return 'required'
    let isValid
    if(testnetCheck) {
        const isTestnetValid = validate(data.withdrawAddress, 'testnet')
        const isRegtestValid = validate(data.withdrawAddress, 'regtest')
        isValid = isTestnetValid || isRegtestValid
    } else {
        isValid = validate(data.withdrawAddress, 'mainnet')
    }
    if(!isValid) {
        return 'invalid_address'
    }
    return false
};
