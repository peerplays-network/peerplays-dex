import {formKeys} from "./formKeys";
import {faucetUrl} from "../../../params/networkParams";
import {formAccountData} from "./formAccountData";
import { dbApi } from "../../nodes";

export const createUser = async (data, result) => {
    const type = data.type ? data.type : 'cloud';

    const {keys, wifs, additionalData} = formKeys[type](data);

    const account = {
        name: data.newLogin,
        active_key: keys.active,
        memo_key: keys.memo,
        owner_key: keys.owner,
        refcode: null,
        referrer: data.referrer || null
    };

    const newUserData = await fetch(faucetUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({account})
    }).then(e => e.json());

    if(newUserData.account){
        result.success = true;
        const account = await dbApi('get_account_by_name', [newUserData.account.name])
        result.callbackData = await formAccountData[type](account, additionalData);
        result.wifs = wifs;
    }
    return result;
};