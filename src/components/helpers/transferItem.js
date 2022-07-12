import React from 'react';
import Translate from 'react-translate-component';

const TransferItem = ({data}) => (
    <div className="operation__row">
        <div className="title"><Translate className="" content={`modal.recive.${data.key}`} /></div>
        <div className="content">
            {console.log("tranferitem page",data.key === "memo" ?data.value.split("\n").map((line, index) => (<div key={index}>{line}</div>)):"55555")}
            {data.key === "memo" ? data.value.split("\n").map((line, index) => (<div key={index}>{line}</div>)) : data.value}
        </div>
    </div>
);

export default TransferItem;