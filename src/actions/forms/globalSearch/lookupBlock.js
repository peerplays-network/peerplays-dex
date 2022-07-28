import React from "react";
import Link from "react-router-dom/es/Link";
import {clearLayout} from "../../../dispatch/layoutDispatch";
import {dbApi} from "../../nodes";
import BlockHeader from "../../../components/helpers/blockHeader";

export const lookupBlock = val => dbApi('get_block', [val]).then(async info => {
    if(!info) return 'No result Found';

    return (
        <Link to={`/block/${val}`} className="global-search__card card" onClick={clearLayout}>
            <BlockHeader num={val} data={info} />
        </Link>
    )
});
