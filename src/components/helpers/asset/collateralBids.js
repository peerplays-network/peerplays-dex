import React, {Component} from "react";
import {CardHeader} from "../cardHeader";
import {defaultToken} from "../../../params/networkParams";
import {Asset} from "../../../classes/index";
import Table from "../table";
import Link from "react-router-dom/es/Link";
import {getUserName} from "../../../actions/account/index";

const tableHead = [
    {
        key: 'bidder',
        translateTag: 'bidder'
    },
    {
        key: 'collateral',
        translateTag: 'collateral',
        translateParams: {
            token: defaultToken
        },
        params: 'fit-content'
    },
    {
        key: 'debt',
        translateTag: 'debt',
        params: 'fit-content'
    },
    {
        key: 'bidPrice',
        translateTag: 'bidPrice',
        params: 'fit-content'
    }
];

const formCollateralBids = async ({basicData, orderData, quoteAsset, baseAsset}) => {
    let dataCollateral = [], bidder, collateral, debt;
    for (let i = 0; i < orderData.length; i++) {
        bidder = await getUserName(orderData[i].borrower);

        const {base, quote} = orderData[i].call_price;
        const newBaseAsset = new Asset({...baseAsset, amount: base.amount});
        const newQuoteAsset = new Asset({...quoteAsset, amount: quote.amount});

        collateral = new Asset({...quoteAsset, amount: orderData[i].collateral}).toString();
        debt = new Asset({...quoteAsset, amount: orderData[i].debt}).toString();

        dataCollateral.push({
            bidder: <Link to={`/user/${bidder}`}>{bidder}</Link>,
            collateral,
            debt,
            bidPrice: `${newBaseAsset.calculatePrice(newQuoteAsset)} ${newBaseAsset.symbol}/${newQuoteAsset.symbol}`
        })
    }

    return dataCollateral;
};

class CollateralBids extends Component {
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

    getData = (params) => formCollateralBids(params).then(data => this.setState({data}));

    render() {
        const data = this.state.data;

        return (
            <div className="fee-pool card">
                <CardHeader title={`block.${this.props.title}.title`}/>
                {
                    data &&
                    <Table
                        tableHead={tableHead}
                        rows={data}
                    />
                }
                <div className="card__footer"/>
            </div>
        )
    }
}

export default CollateralBids;