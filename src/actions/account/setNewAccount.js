import {clearLayout} from "../../dispatch";
import {getStorage, removeStorageItem, setStorage} from "../storage";
import {setAccount} from "../../dispatch/setAccount";
import { formAccount } from ".";
import CloudAccount from "../../classes/cloudAccount";

export const setNewAccount = async (data) => {
    if(typeof getStorage('referrer', 'sessionStorage') === 'string') removeStorageItem('referrer', 'sessionStorage');
    setStorage('account', data.localData);

    const account = data.localData
    let userData = false;

    if (account.type) {
        userData = await formAccount(account.name);
    }

    if (userData) {
        setAccount({
            loginData: new CloudAccount(),
            accountData: userData
        });
    }

    clearLayout();
    
};