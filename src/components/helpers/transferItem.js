import React from 'react';
import Translate from 'react-translate-component';

const TransferItem = ({data}) => (
    <div className="operation__row">
        <div className="title">{data.key}</div>
        <div className="content">
            {data.key === "memo" ? data.value.split("\n").map((line, index) => (<div key={index}>{line}</div>)) : data.value}
        </div>
    </div>
);

export default TransferItem;