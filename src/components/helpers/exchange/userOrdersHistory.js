import React from "react";
import Table from "../table";
import NoData from "../noData";
import TableCard from "../../helpers/cards";

const UserOrdersHistory = ({data}) => {
    if(!data) return <NoData />;

    return (
        <div className="custom-scroll">
            <Table className="table--exchange" tableHead={data.tableHead} rows={data.rows} />
            <TableCard tableHead={data.tableHead} rows={data.rows}/>
        </div>
    );
};

export default UserOrdersHistory;