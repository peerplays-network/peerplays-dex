import React, {Component, Fragment} from 'react';
import dataFetch from "../../dataFetch";
import Translate from "react-translate-component";
import {transactionParser} from "../../../../actions/transactionParser";
import TransferItem from "../../transferItem";
import {ChainTypes} from "peerplaysjs-lib";
import Close from "../decoration/close";

const getType = opNumber => {
    const operationsIndexes = Object.values(ChainTypes.operations);
    const operationsNames = Object.keys(ChainTypes.operations);

    return operationsNames[operationsIndexes.indexOf(opNumber)].toLowerCase();
};

const fetchFunc = async (context) => {
    const {operation, password} = context.props;
    const {trx_in_block, block_num} = operation;

    const type = getType(operation.op[0]);

    const basicTag = `tableInfo.${type}`;
    const operationData = operation.op[1] 
    operationData.type = type

    const info = await transactionParser(operationData, password, true).then(e => e);
    return {
        type: <Translate content={`${basicTag}.title`} component="div" className="operation positive"/>,
        info,
        blockNum: block_num,
        trxNum: trx_in_block
    }
};

class TransactionModal extends Component {

    render() {
        return (
            <Fragment>
                <div className="modal__header">
                    <h1>Block #{this.props.data.blockNum}</h1>
                </div>
                <div className="operation__block">
                    <div className="header">
                        {!!(this.props.data.trxNum) && <div className="number">#{this.props.data.trxNum}</div>}
                        {this.props.data.type}
                    </div>
                    {
                        this.props.data.info.map((item, index) => <TransferItem data={item} key={index}/>)
                    }
                </div>

                <div className="modal__bottom">
                    <Close tag="close" />
                </div>
            </Fragment>
        )
    }
}

export default dataFetch({ method: fetchFunc })(TransactionModal);
