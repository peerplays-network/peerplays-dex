import React from "react";
import Table from "../../helpers/table";
import dataFetch from "../../helpers/dataFetch";
import {getOrders} from "../../../actions/dataFetching/accountData/";
import TableCard from "../../helpers/cards";


const OpenOrders = ({data}) =>(
    <div>
    <Table tableHead={data.tableHead} rows={data.rows} />
    <TableCard tableHead={data.tableHead} rows={data.rows}/>
    </div>
);

export default dataFetch({ method: getOrders, page: 'userOrders' })(OpenOrders);