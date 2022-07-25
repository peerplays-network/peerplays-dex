import {dbApi} from "./nodes";
import {Asset} from "../classes";
import Link from "react-router-dom/es/Link";
import React from "react";
import {clearLayout} from "../dispatch";
import { Aes } from "peerplaysjs-lib";
import { getBasicAsset, getStore } from "./store";
import { formAssetData } from "./assets";

export const transactionParser = async (operation, password = '' , keyType) => {
    let asset, info = [];
    const type = operation.type
    const operationWithoutType = Object.keys(operation).filter(key =>
        key !== 'type').reduce((obj, key) =>
        {
            obj[key] = operation[key];
            return obj;
        }, {}
    );

    for (let key in operationWithoutType) {
        if (key === 'extensions') continue;

        let item = operation[key];
        if (!item) continue;

        if(type === 'asset_fund_fee_pool' && key === 'amount') {
            const basicAsset = getBasicAsset();
            const asset = await formAssetData({asset_id: basicAsset.id, amount: item});
            info.push({
                key,
                value: asset.toString()
            });
            continue
        }

        if (key === 'memo') {
            const {loginData, accountData} = getStore();
            const message = item.message;
            let value;
            if (message.slice(0, 8) === "00000000") {
                value = (Buffer.from(message.slice(8), 'hex')).toString()
            } else {
                if(password) {
                    const fromAccount = await dbApi('get_account_by_name',[accountData.name]);
                    let publicKey = item.from;
        
                    if (accountData.id === operation.from) {
                        publicKey = item.to;
                    }
    
                    let memoFromPrivkey;
                   
                    memoFromPrivkey = loginData.formPrivateKey(password, 'memo');
                   
                    try {
                        value = (Aes.decrypt_with_checksum(memoFromPrivkey, publicKey, item.nonce, message)).toString();
                    } catch (e) {
                        console.error('Could not decode message.');
                    }
                } else {
                    try {
                        const response = await window.whalevault
                            .promiseRequestDecryptMemo("peerplays-dex", `ppy:${accountData.name}`, message, "memo", "")
                        if(response.success) {
                            value = response.message
                        } else {
                            console.error('Could not decode message.');
                        }
                    } catch(e) {
                        console.error('Could not decode message.');
                    }
                }
            }
            
            info.push({
                key: "memo",
                value
            })
            continue;
        }

        if (typeof(item) === 'string') {
            if (item.match(/1\.2/)) {
                let account = await dbApi('get_accounts', [[item]]).then(e => e[0].name);
                info.push({
                    key,
                    value: <Link to={`/user/${account}`}
                                 className="link_account" onClick={clearLayout}>{account}</Link>
                });
                continue;
            }
        } else if (typeof(item) === 'object') {
            if (item.amount !== undefined && item.asset_id) {
                asset = await new Asset({
                    id: item.asset_id,
                    amount: item.amount
                }).getDataById();

                info.push({
                    key,
                    value: asset.toString()
                });
            } else {
                info.push({
                    key,
                    value: JSON.stringify(item)
                });
            }
            continue;
        }

        info.push({
            key,
            value: item
        });
    }

    return info;
};
