import React, {Component} from 'react';
import BlockHeader from "./blockHeader";
import {dbApi} from "../../actions/nodes";
import dataFetch from "./dataFetch";
import TransferItem from "./transferItem";
import {transactionParser} from "../../actions/transactionParser";
import {ChainTypes} from "peerplaysjs-lib";
import counterpart from 'counterpart';

const getType = opNumber => {
    const operationsIndexes = Object.values(ChainTypes.operations);
    const operationsNames = Object.keys(ChainTypes.operations);

    return operationsNames[operationsIndexes.indexOf(opNumber)].toLowerCase();
};

const fetchFunc = async (context) => {
    const blockNum = context.props.match.params.number;
    const dataBlock = await dbApi('get_block', [blockNum]).then(e => e);

    let transaction = [];

    await Promise.all(
        dataBlock.transactions.map(async item => {
            const type = getType(item.operations[0][0]);
            const basicTag = `tableInfo.${type}`;
            const info = await transactionParser(item.operations[0][1]).then(e => e);

            transaction.push({
                type: <div className="operation positive">{counterpart.translate(`${basicTag}.title`)}</div>,
                info
            })
        })
    );

    // console.log('transaction', transaction);

    return {
        dataBlock,
        transaction,
        blockNum
    }
};

class Block extends Component {

    componentDidMount() {
    }

    render() {
        const transaction = this.props.data.transaction;

        return (
            <div className="block-container">
                <div className="global-search__card card">
                    <BlockHeader  num={this.props.data.blockNum} data={this.props.data.dataBlock}/>
                </div>
                <div>
                    {
                        transaction.map((item, index) =>
                            <div className="operation__block card" key={index}>
                                <div className="header">
                                    <div className="number">#{index}</div>
                                    {item.type}
                                </div>
                                {
                                    item.info.map((item, i) => <TransferItem data={item} key={i}/>)
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default dataFetch({ method: fetchFunc })(Block);
