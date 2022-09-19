import React from "react";
import {dbApi} from "./nodes";
import {Link} from "react-router-dom";
import IconLink from '../svg/link.svg';
import IconKey from '../svg/key.svg'
import {setAssets} from "./setAssets";

export const getWitnesses = async () => {
    let witnessesID = [],
        allWitnesses = [];

    witnessesID = await dbApi('lookup_witness_accounts', ['', 100]).then(e => e);
    const activeUsers = await dbApi('get_global_properties').then(e => e);

    return await dbApi('get_witnesses', [witnessesID.map(item => item[1])]).then(async e => {
        let allWitnesses = e
            .map(async (item) => {
                return ({
                ...item,
                url: item.url.length ? <a href={item.url} target="_blank" className="link"><IconLink/></a> : '',
                name: <Link to={`/user/${witnessesID.filter(name => name[1] === item.id)[0][0]}`}
                            className="user__link">{witnessesID.filter(name => name[1] === item.id)[0][0]}</Link>,
                signing_key: <Link to={item.signing_key}><IconKey/></Link>,
                total_votes: (await setAssets({quantity: Number(item.total_votes), asset: '1.3.0'}))
            })});

        allWitnesses = await Promise.all(allWitnesses);

        return allWitnesses.map(item => ({
            ...item,
            active: activeUsers['active_witnesses'].indexOf(item.id) >= 0
        }));
    });
};