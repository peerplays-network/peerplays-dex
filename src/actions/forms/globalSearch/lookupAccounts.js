import React from "react";
import {clearLayout} from "../../../dispatch/layoutDispatch";
import {ContactItem} from "../../../components/helpers/contactItem";
import {defaultToken} from "../../../params/networkParams";
import {dbApi} from "../../nodes";
import { getAccountData } from "../../store";

const setAccountItem = (data) => <ContactItem key={data.id} data={data} handleClick={clearLayout} />;

export const lookupAccounts = async val => {
    if(val.indexOf(defaultToken) === 0 && val.length === 54) return dbApi('get_key_references', [[val]])
        .then(result => result[0]
            ? dbApi('get_accounts', [[result[0][0]]])
                .then(userList => userList.map(({name, id}) => setAccountItem({name, id}))).catch(() => [])
            : []
        );
    let result = await dbApi('lookup_accounts', [val, 1000])
        .then(result => result.filter(e => e[0].includes(val)).map(([name, id]) => setAccountItem({name, id})))
    const account = getAccountData();
    let filteredResult = [...result];
    if(filteredResult.length > 0 && account && account.id) {
        filteredResult = filteredResult.filter(r => r.key !== account.id);
    }
    if (filteredResult.length > 0) {
        return filteredResult;
    }
    return 'No result Found';
};
