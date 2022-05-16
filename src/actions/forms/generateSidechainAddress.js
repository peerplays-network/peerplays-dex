import {getStore} from "../store";
import {trxBuilder} from "./trxBuilder";
import {getDefaultFee} from "./getDefaultFee";
import { getSidechainAccounts } from '../account/getSidechainAccounts';
import { getSonNetworkStatus } from "../getSonNetworkStatus";

export const generateSidechainAddress = async (data) => {
    const {loginData, accountData} = getStore();
    const payer = accountData.id;
    const sidechain = data.sidechain.toLowerCase();    
    const deposit_public_key = data.depositPublicKey;
    const deposit_address = (sidechain == 'bitcoin') ? '' : data.depositAddress ? data.depositAddress : '' ;
    const deposit_address_data = (sidechain == 'bitcoin') ? '' : data.depositAddressData ? data.depositAddressData : ''; 
    const withdraw_public_key = data.withdrawPublicKey;
    const withdraw_address = data.withdrawAddress;
    const result = {
        success: false,
        errors:{},
        callbackData:'',
        sidechainAccounts: {}
    };

    const sonNetworkStatus = await getSonNetworkStatus();
    if(!sonNetworkStatus.isSonNetworkOk){
        result.errors = "ERROR";
        return result;
    }

    const trx = {
        type: 'sidechain_address_add',
        params: {
            fee: getDefaultFee(),
            payer,
            sidechain_address_account: payer,
            sidechain,
            deposit_public_key,
            deposit_address,
            deposit_address_data,
            withdraw_public_key,
            withdraw_address
        }
    };
    
    try {
        const activeKey = loginData.formPrivateKey(data.password, 'active');
        const trxResult = await trxBuilder([trx], [activeKey]);   
        if (trxResult) {
            result.success = true;
            result.callbackData = trxResult;
            result.sidechainAccounts = await getSidechainAccounts(payer);
        }
    } catch (error) {
        const err = error.toString();
        err.includes('An active deposit key already exists') ? result.errors = "DUPLICATE" : result.errors = "ERROR";
    }

    return result;
};