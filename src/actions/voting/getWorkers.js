import React from "react";
import {dbApi} from "../nodes";
import {setAssets} from "../setAssets";
import IconLink from "../../svg/link.svg";
import {Link} from "react-router-dom";

const newDateFormat = (date) => {
    let newDate = new Date(date);
    newDate = newDate.toDateString().split(" ");
    return newDate[1] + " " + newDate[2] + ", " + newDate[3];
};

export const getWorkers = async () => {
    const workers = await dbApi('get_all_workers').then(e => e);

    const workerBalance = await dbApi('get_objects', [workers.map(elem => elem.worker[1].balance)]).then(e => e);
    const workerAsset = await dbApi('lookup_asset_symbols', [workerBalance.map(elem => elem.balance.asset_id)]).then(e => e);

    let workersAmount = workerBalance.map(async (item, index) => ({
        amount: (await setAssets({quantity: Number(item.balance.amount), asset: item.balance.asset_id})),
        asset: workerAsset[index].symbol
    }));

    workersAmount = await Promise.all(workersAmount);

    let workersFix = workers.map(async (item, index) => ({
        ...item,
        duration: newDateFormat(item.work_begin_date) + " - " + newDateFormat(item.work_end_date),
        balance: workersAmount[index],
        daily_pay: (await setAssets({quantity: Number(item.daily_pay), asset: '1.3.0'})),
        url: item.url.length ? <Link to={item.url}><IconLink/></Link> : '',
        votes: (await setAssets({quantity: Number(item.total_votes_for), asset: '1.3.0'}))
    }));

    workersFix = await Promise.all(workersFix);

    return workersFix;
};