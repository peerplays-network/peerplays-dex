import React, {Component} from "react";
import {CardHeader} from "../cardHeader";
import {Asset} from "../../../classes/index";
import counterpart from "counterpart";

const infoElems = ['settlementPrice', 'settlementFunds', 'settlementFundCollateralRatio'];

const formSettlement = async ({smartData, quoteAsset, baseAsset}) => {
    const {settlement_fund, settlement_price} = smartData;

    const newBaseAsset = new Asset({...baseAsset, amount: settlement_price.base.amount});
    const newQuoteAsset = new Asset({...quoteAsset, amount: settlement_price.quote.amount});

    return {
        settlementPrice: {
            title: <span>{counterpart.translate(`block.settlement.settlementPrice`)}</span>,
            text: isNaN(newBaseAsset.calculatePrice(newQuoteAsset)) ? '-' : `${newBaseAsset.calculatePrice(newQuoteAsset)} ${newBaseAsset.symbol}/${newQuoteAsset.symbol}`
        },
        settlementFunds: {
            title: <span>{counterpart.translate(`block.settlement.settlementFunds`)}</span>,
            text: settlement_fund
        },
        settlementFundCollateralRatio: {
            title: <span>{counterpart.translate(`block.settlement.settlementFundCollateralRatio`)}</span>,
            text: 0
        }
    }
};

class Settlement extends Component {
    state = {
        data: ''
    };

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.basicData && (this.props.basicData.symbol !== nextProps.basicData.symbol)){
            this.getData(nextProps);
        }
    }

    getData = (params) => formSettlement(params).then(data => this.setState({data}));

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

export default Settlement;