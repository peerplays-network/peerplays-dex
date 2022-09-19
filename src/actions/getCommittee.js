import React from "react";
import {dbApi} from "./nodes";
import {Link} from "react-router-dom";
import {setAssets} from "./setAssets";
import IconLink from "../svg/link.svg";

export const getCommittee = async () => {
    const committeeID = await dbApi('lookup_committee_member_accounts', ['', 100]).then(e => e);
    const activeUsers = await dbApi('get_global_properties').then(e => e);

    return await dbApi('get_committee_members', [committeeID.map(item => item[1])]).then(async e => {
        let allCommittee = e
            .map(async (item) => {
                return ({
                ...item,
                url: item.url.length ? <a href={item.url} target="_blank" className="link"><IconLink/></a> : '',
                name: <Link to={`/user/${committeeID.filter(name => name[1] === item.id)[0][0]}`}
                            className="user__link">{committeeID.filter(name => name[1] === item.id)[0][0]}</Link>,
                total_votes: (await setAssets({quantity: Number(item.total_votes), asset: '1.3.0'}))
            })});

        allCommittee = await Promise.all(allCommittee);

        return allCommittee.map(item => ({
            ...item,
            active: activeUsers['active_committee_members'].indexOf(item.id) >= 0
        }));
    });
};