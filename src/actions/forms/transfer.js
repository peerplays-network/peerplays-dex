import {TransactionHelper, Aes} from "peerplaysjs-lib";
import {dbApi} from "../nodes";
import {trxBuilder} from "./trxBuilder";
import {getStore} from "../store";
import {getDefaultFee} from "./getDefaultFee";
import { getSonNetworkStatus } from "../getSonNetworkStatus";

export const transfer = async (data) => {
    const result = {
        success: false,
        errors:{},
        callbackData:'',
    };
    
    if(data.to === data.from){
        result.errors['to'] = 'sendYourself';
        return result;
    }
    const gpo = await dbApi('get_global_properties');
    const son_account = gpo.parameters.extensions.son_account;
    if(data.to === "son-account" || data.to === son_account) {
        const sonNetworkStatus = await getSonNetworkStatus();
        if(!sonNetworkStatus.isSonNetworkOk){
            result.errors['quantity'] = "sonNotAvailable";
            return result;
        }
    }
  
    const toAccount = await dbApi('get_account_by_name', [data.to]).then(e => e);

    if(!toAccount){
        result.errors['to'] = 'noAcc';
        return result;
    }

    const {loginData, accountData} = getStore();
    const asset = accountData.assets.find(e => e.symbol === data.quantityAsset);
    const fromAccount = await dbApi('get_account_by_name',[accountData.name]);
    const password = data.password;
    const memo = data.memo;
    let memoFromPublic, memoToPublic;

    if (memo) {
        memoFromPublic = fromAccount.options.memo_key;
        memoToPublic = toAccount.options.memo_key;
    }

    let memoFromPrivkey;

    const activeKey = loginData.formPrivateKey(password, 'active');
    if (memo) {
        if (fromAccount.options.memo_key === fromAccount.active.key_auths[0][0]) {
            memoFromPrivkey = loginData.formPrivateKey(password, 'active');
        } else {
            memoFromPrivkey = loginData.formPrivateKey(password, 'memo');
        }
        if (!memoFromPrivkey) {
            throw new Error('Missing private memo key for sender: ' + fromAccount);
        }

    }

    let memoObject;

    if (memo && memoFromPublic && memoToPublic) {
        if (!(/111111111111111111111/.test(memoFromPublic)) && !(/111111111111111111111/.test(memoToPublic))) {
            let nonce = TransactionHelper.unique_nonce_uint64();
            memoObject = {
                from: memoFromPublic,
                to: memoToPublic,
                nonce,
                message: Aes.encrypt_with_checksum(
                    memoFromPrivkey,
                    memoToPublic,
                    nonce,
                    memo
                )
            };
        } else {
            memoObject = {
                from: memoFromPublic,
                to: memoToPublic,
                nonce: 0,
                message: Buffer.isBuffer(memo) ? memo : Buffer.concat([Buffer.alloc(4), Buffer.from(memo.toString('utf-8'), 'utf-8')])
            };
        }
    }

    const amount = {
        amount: data.quantity * (10 ** asset.precision),
        asset_id: asset.id
    };

    const fee = getDefaultFee();

    const trx = {
        type: 'transfer',
        params: {
            fee,
            from: fromAccount.id,
            to: toAccount.id,
            amount,
            memo: memoObject
        }
    };

    const trxResult = await trxBuilder([trx], [activeKey]);

    if(trxResult){
        result.success = true;
        result.callbackData = trxResult;
    }

    return result;
};