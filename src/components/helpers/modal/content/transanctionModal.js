import React, {Component, Fragment} from 'react';
import dataFetch from "../../dataFetch";
import {dbApi} from "../../../../actions/nodes/index";
import Translate from "react-translate-component";
import BlockHeader from "../../blockHeader";
import {transactionParser} from "../../../../actions/transactionParser";
import TransferItem from "../../transferItem";
import {ChainTypes} from "peerplaysjs-lib";
import {clearLayout} from "../../../../dispatch/index";
import Close from "../decoration/close";

const fetchFunc = async (context) => {
    const { blockNum, trxNum, password, op } = context.props;
    const dataBlock = await dbApi('get_block', [blockNum]).then(e => e);
    
    const operationsNames = Object.keys(ChainTypes.operations);
    let type = operationsNames[op].toLowerCase();
    
    const basicTag = `tableInfo.${type}`;
    const operation = dataBlock.transactions[trxNum].operations[0][1];
    operation.type = type
    const info = await transactionParser(operation, password).then(e => e);

    return {
        dataBlock,
        type: <Translate content={`${basicTag}.title`} component="div" className="operation positive"/>,
        info,
        blockNum,
        trxNum
    }
};

class TransactionModal extends Component {

    componentDidMount() {
    }

    render() {
        return (
            <Fragment>
                <div className="modal__header">
                    <h1>Block #{this.props.blockNum}</h1>
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
