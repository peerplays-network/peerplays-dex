import React from 'react';
import parse from "html-react-parser";

const TransferItem = ({data}) => (
    <div className="operation__row">
        <div className="title">{data.key}</div>
        {data.key === "memo" ? 
        <div className="content">{parse(`${data.value}`)}</div> :
        <div className="content">{data.value}</div> }
    </div>
);

export default TransferItem;