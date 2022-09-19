import React from "react";
import {dbApi} from "./nodes";
import {ChainTypes} from "peerplaysjs-lib"
import {setAssets} from "./setAssets";
import { getBasicAsset } from "./store";

export const getFees = async () => {
    const basicAsset = getBasicAsset()
    let globalProps = {},
        operations = [];

    const operationsNames = Object.keys(ChainTypes.operations);

    globalProps = await dbApi('get_global_properties').then(e => e['parameters']['current_fees']['parameters']);

    operations = operationsNames.map((item, index) => ({
        name: item.split('_').join(' ').toUpperCase(),
        ...globalProps[index]
    }));

    operations = operations.map(async (item) => {
        if('1' in item) {
            return {
                fee: 'fee' in item[1] ? await setAssets({
                    quantity: Number(item[1]['fee']),
                    asset: '1.3.0'
                }) + ` ${basicAsset.symbol}` : `0 ${basicAsset.symbol}`,
                membership_lifetime_fee: 'membership_lifetime_fee' in item[1] ? await setAssets({
                    quantity: Number(item[1]['membership_lifetime_fee']),
                    asset: '1.3.0'
                }) + ` ${basicAsset.symbol}` : '',
                price_per_kbyte: 'price_per_kbyte' in item[1] ? await setAssets({
                    quantity: Number(item[1]['price_per_kbyte']),
                    asset: '1.3.0'
                }) + ` ${basicAsset.symbol}` : '',
                name: <span className="operation positive">{item['name']}</span>
            }
        } else {
            return {
                fee: '',
                membership_lifetime_fee: '',
                price_per_kbyte: '',
                name: <span className="operation positive">{item['name']}</span>
            }
        }
    });

    operations = await Promise.all(operations);

    return operations;
};