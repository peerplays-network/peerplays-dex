import {PrivateKey, Login} from "peerplaysjs-lib";
import Account from "./account";
import {getAccountData} from "../actions/store";
import {getStoragedAccount} from "../actions/account";
import { defaultToken } from "../params/networkParams";

class CloudAccount extends Account{
    checkPassword(password, account, keyType = ''){
        if(!account) account = getAccountData();

        const login = account.name;
        const roles = ['active', 'owner', 'memo'];

        const keys = {
            active: account.active || account.keys.active,
            owner: account.owner || account.keys.owner,
            memo: account.options || account.keys.memo,
        };

        let result = false;
        let fromWif = '';
        let type = "";

        try{ fromWif = PrivateKey.fromWif(password) }
        catch(e){ }

        const generatedKeys = Login.generateKeys(login, password, roles);
        
        if(!keyType) {
            for(let role of roles){
                const privKey = fromWif ? fromWif : generatedKeys.privKeys[role];
                const pubKey = privKey.toPublicKey().toString();
                const key = role !== 'memo' ? keys[role].key_auths[0][0] : keys.memo.memo_key;
                if(key === pubKey){
                    type = !fromWif ? "password" : role;
                    result = true;
                    break;
                }
            }
        } else {
            const privKey = fromWif ? fromWif : generatedKeys.privKeys[keyType];
            const pubKey = privKey.toPublicKey().toString();
            const key = keyType !== 'memo' ? keys[keyType].key_auths[0][0] : keys.memo.memo_key;
            if(key === pubKey){
                type = !fromWif ? "password" : keyType;
                result = true;
            }
        }       

        if(result) this.savePassword(password, type);

        return result;
    }
    formPrivateKey(password = this.password, role){
        let fromWif = '';

        try{ fromWif = PrivateKey.fromWif(password) }
        catch(e){ }

        return fromWif ? fromWif : Login.generateKeys(getStoragedAccount().name, password, [role]).privKeys[role];
    }
    checkWhaleVaultPubKeys(pubKeys, account) {
        if(!account) account = getAccountData();

        const roles = ['active', 'owner', 'memo'];
        const keys = {
            active: account.active || account.keys.active,
            owner: account.owner || account.keys.owner,
            memo: account.options || account.keys.memo,
        };
        let result = false;

        for(let role of roles){
            let pubKey = pubKeys[`${role}Pubkey`]
            const key = role !== 'memo' ? keys[role].key_auths[0][0] : keys.memo.memo_key;
            pubKey = pubKey ? pubKey.slice(0, 4).includes(defaultToken) ? pubKey : pubKey.replace('PPY', defaultToken) : pubKey;

            if(key === pubKey){
                result = true;
                break;
            }
        }

        if(result) this.updateReduxData();
        return result;
    }
}

export default CloudAccount;