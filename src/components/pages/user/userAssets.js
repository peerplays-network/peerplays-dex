import React from "react";
import Table from "../../helpers/table";
import dataFetch from "../../helpers/dataFetch";
import {getUserAssets} from "../../../actions/dataFetching/accountData";
import TableCard from "../../helpers/cards";

const UserAssets = ({data}) => (
    <div>
        <Table
            tableHead={data.tableHead}
            rows={data.rows}
            link={{ path: '/asset/', key: 'symbol' }}
        />
        <TableCard tableHead={data.tableHead} rows={data.rows} link={{ path: '/asset/', key: 'symbol' }}/>
    </div>
    
);

export default dataFetch({ method: getUserAssets })( UserAssets );