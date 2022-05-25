import {clearLayout} from "../../dispatch";
import {getStorage, removeStorageItem, setStorage} from "../storage";
import {setAccount} from "../../dispatch/setAccount";

export const setNewAccount = async (data) => {
    console.log(data)
    if(typeof getStorage('referrer', 'sessionStorage') === 'string') removeStorageItem('referrer', 'sessionStorage');
    setStorage('account', data.localData);
    setAccount(data);
    //clearLayout();
    //debugger
    //window.location.reload(true);
};