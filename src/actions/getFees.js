import React from "react";
import {dbApi} from "./nodes";
import {ChainTypes} from "peerplaysjs-lib"
import {setAssets} from "./setAssets";
import {defaultToken} from "../params/networkParams";

export const getFees = async () => {
    let globalProps = {},
        operations = [];

    const operationsNames = Object.keys(ChainTypes.operations);

    globalProps = await dbApi('get_global_properties').then(e => e['parameters']['current_fees']['parameters']);

    operations = operationsNames.map((item, index) => ({
        name: item.split('_').join(' ').toUpperCase(),
        ...globalProps[index]
    }));

    operations = operations.map(async (item) => {
        console.log(defaultToken)
        if('1' in item) {
            return {
                fee: 'fee' in item[1] ? await setAssets({
                    quantity: Number(item[1]['fee']),
                    asset: '1.3.0'
                }) + ` ${defaultToken}` : `0 ${defaultToken}`,
                membership_lifetime_fee: 'membership_lifetime_fee' in item[1] ? await setAssets({
                    quantity: Number(item[1]['membership_lifetime_fee']),
                    asset: '1.3.0'
                }) + ` ${defaultToken}` : `0 ${defaultToken}`,
                price_per_kbyte: 'price_per_kbyte' in item[1] ? await setAssets({
                    quantity: Number(item[1]['price_per_kbyte']),
                    asset: '1.3.0'
                }) + ` ${defaultToken}` : `0 ${defaultToken}`,
                name: <span className="operation positive">{item['name']}</span>
            }
        } else {
            return {
                fee: `0 ${defaultToken}`,
                membership_lifetime_fee: `0 ${defaultToken}`,
                price_per_kbyte: `0 ${defaultToken}`,
                name: <span className="operation positive">{item['name']}</span>
            }
        }
    });

    operations = await Promise.all(operations);
    
    return operations;
};