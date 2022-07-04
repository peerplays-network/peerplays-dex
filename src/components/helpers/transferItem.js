import React from 'react';
import parse from "html-react-parser";
import Translate from 'react-translate-component';

const TransferItem = ({data}) => (
    <div className="operation__row">
        <div className="title"><Translate className="" content={`modal.recive.${data.key}`} /></div>
        {data.key === "memo" ? 
        <div className="content">{parse(`${data.value}`)}</div> :
        <div className="content">{data.value}</div> }
    </div>
);

export default TransferItem;