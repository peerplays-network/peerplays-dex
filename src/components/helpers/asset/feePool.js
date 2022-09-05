import React, {Component} from "react";
import {CardHeader} from "../cardHeader";
import {Asset} from "../../../classes/index";
import counterpart from "counterpart";

const infoElems = ['coreExchangeRate', 'feePool', 'unclaimedIssuerIncome'];

const formFeePool = async ({basicData, dynamicData, quoteAsset, baseAsset}) => {
    const {base, quote} = basicData.options.core_exchange_rate;
    const {fee_pool, accumulated_fees} = dynamicData;

    const newBaseAsset = new Asset({...baseAsset, amount: base.amount});
    const newQuoteAsset = new Asset({...quoteAsset, amount: quote.amount});

    const feeAsset = new Asset({...baseAsset, amount: fee_pool});

    return {
        coreExchangeRate: {
            title: <span>{counterpart.translate(`block.fee.coreExchangeRate`)}</span>,
            text: `${newQuoteAsset.calculatePrice(newBaseAsset)} ${newQuoteAsset.symbol}/${newBaseAsset.symbol}`
        },
        feePool: {
            title: <span>{counterpart.translate(`block.fee.feePool`)}</span>,
            text: feeAsset.toString()
        },
        unclaimedIssuerIncome: {
            title: <span>{counterpart.translate(`block.fee.unclaimedIssuerIncome`)}</span>,
            text: accumulated_fees ? newQuoteAsset.toString(accumulated_fees) : `0 ${quoteAsset.symbol}`
        }
    }
};

class FeePool extends Component {
    state = {
        data: ''
    };

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.basicData && (this.props.basicData.symbol !== nextProps.basicData.symbol)){
            this.getData(nextProps)
        }
    }

    getData = (params) => formFeePool(params).then(data => this.setState({data}));

    render() {
        const data = this.state.data;
        const title = this.props.title;

        return (
            <div className="fee-pool card">
                <CardHeader title={`block.${title}.title`}/>
                <div className="card__comment">{counterpart.translate(`block.${title}.text`)}</div>
                {
                    data && <div className="asset-stats__items">
                        {infoElems.map((elem, index) => (
                            <div className="asset-stats__item" key={index}>
                                {data[elem].title}
                                <span>{data[elem].text}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>
        )
    }
}

export default FeePool;