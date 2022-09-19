import {decryptHex, generatePublic, seedToHex} from "../actions/keys";
import Account from "./account";
import {PrivateKey, key, hash} from "peerplaysjs-lib";
import {editStorage, getStorage} from "../actions/storage";
import {getAccountData} from "../actions/store";
import {getStoragedAccount} from "../actions/account";

class Wallet extends Account{
    constructor({
        backup_date = '',
        brainkey_backup_date = '',
        brainkey_pubkey = '',
        brainkey_sequence = '',
        chain_id = '',
        created = '',
        encrypted_brainkey = '',
        encryption_key = '',
        id = '',
        last_modified = '',
        password_pubkey = '',
        public_name = '',
    }){
        super();
        this.id = id;
        this.backup_date = backup_date;
        this.brainkey_backup_date = brainkey_backup_date;
        this.brainkey_pubkey = brainkey_pubkey;
        this.brainkey_sequence = brainkey_sequence;
        this.chain_id = chain_id;
        this.created = created;
        this.encrypted_brainkey = encrypted_brainkey;
        this.encryption_key = encryption_key;
        this.last_modified = last_modified;
        this.password_pubkey = password_pubkey;
        this.public_name = public_name;
    }
    checkPassword(password){
        const pubkey = generatePublic(password);
        const result = this.password_pubkey === pubkey;

        if(result) this.savePassword(password);

        return result;
    }
    formPrivateKey(password, type){

        const keyBuffer = this.getKeyBuffer(password);
        const brainKey = this.decryptBrain(keyBuffer);

        const normalizedBrainKey = key.normalize_brainKey(brainKey);
        const userKeys = getAccountData().keys[type].key_auths;

        let result = '';

        getStoragedAccount().walletData.private_keys.find(key => {
            const privateKeyBuffer = decryptHex('buffer', keyBuffer, key.encrypted_key);
            const privateKey = PrivateKey.fromBuffer(privateKeyBuffer);
            const publicKey = generatePublic(privateKey);

            if(publicKey !== key.pubkey) return;

            let privateKeyFromBK = PrivateKey.fromBuffer(hash.sha256(hash.sha512(normalizedBrainKey + " " + key.brainkey_sequence)));
            const pubKeyFromBK = generatePublic(privateKeyFromBK);

            // console.log(pubKeyFromBK, key.pubkey);

            if(pubKeyFromBK !== key.pubkey) return;

            const isNeededType = userKeys.find(el => el[0] === publicKey);

            if(isNeededType) {
                result = privateKey;
                return true;
            }
        });

        // console.log(result);

        return result;
    }
    reEncrypt(password, newBuffer){
        const brain = this.decryptBrain(password);
        this.encrypted_brainkey = seedToHex(newBuffer, brain);
        this.modify();
    }
    modify(){
        this.modified = new Date().getTime();
        // putToDB('wallets', this);
    }
    onModify(modType){
        const modifications = {
            backup: 'backup_date',
            brainkey: 'brainkey_backup_date',
            modified: 'last_modified',
        };

        const changedParam = modifications[modType];
        this[changedParam] = new Date().toISOString();
        this.updateReduxData();
        this.updateStorage();
    }
    updateStorage(){
        const wallet = {...this};
        const walletData = getStoragedAccount().walletData;

        ['password', 'timeout'].forEach(data => delete wallet[data]);

        walletData.wallet = [wallet];

        editStorage('account', {walletData});
    }
    getKeyBuffer(password){
        if(!password) return console.log('password needed!');
        return decryptHex('buffer', password, this.encryption_key);
    }
    decryptBrain(data){
        let keyBuffer = data;

        if(typeof data === 'string') keyBuffer = this.getKeyBuffer(data);

        if(!keyBuffer) return console.log('keyBuffer needed!');
        if(!this.encrypted_brainkey) return console.log('nothing to decrypt!');
        return decryptHex('text', keyBuffer, this.encrypted_brainkey);
    }
}

export default Wallet;