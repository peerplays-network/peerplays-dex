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

const getType = opNumber => {
    const operationsIndexes = Object.values(ChainTypes.operations);
    const operationsNames = Object.keys(ChainTypes.operations);

    return operationsNames[operationsIndexes.indexOf(opNumber)].toLowerCase();
};

const fetchFunc = async (context) => {
    const {blockNum, trxNum, password} = context.props;
    const dataBlock = await dbApi('get_block', [blockNum]).then(e => e);

    const type = getType(dataBlock.transactions[trxNum].operations[0][0]);

    const basicTag = `tableInfo.${type}`;
    const operation = dataBlock.transactions[trxNum].operations[0][1];
    const info = await transactionParser(operation, password).then(e => {
        e.map((item) => {
            
            if(item.key == "memo") item.value = item.value.split("\n").join("<br/>")
            return item;
        })
        return e
    });
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
