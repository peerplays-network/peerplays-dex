import React, {Component, Fragment} from "react";
import {CardHeader} from "../../helpers/cardHeader";
import {Asset} from "../../../classes";
import {getUserName} from "../../../actions/account";
import Table from "../../helpers/table";
import Link from "react-router-dom/es/Link";
import {formDate} from "../../../actions/formDate";
import {defaultToken} from "../../../params/networkParams";

const defaultTableHead = [
    {
        key: 'publisher',
        translateTag: 'publisher'
    },
    {
        key: 'settlementPrice',
        translateTag: 'settlementPrice',
        params: 'fit-content'
    },
    {
        key: 'cer',
        translateTag: 'cer',
        params: 'fit-content'
    },
    {
        key: 'mcr',
        translateTag: 'mcr',
        params: 'fit-content'
    },
    {
        key: 'mssr',
        translateTag: 'mssr',
        params: 'fit-content'
    },
    {
        key: 'time',
        translateTag: 'time',
        params: 'fit-content'
    }
];

const formPriceFeedData = async ({feeds, quoteAsset, baseAsset}) => {
    let priceFeedData = [], token = '';
    for (let i = 0; i < feeds.length; i++) {
        const time = feeds[i][1][0];
        let {core_exchange_rate, maintenance_collateral_ratio, maximum_short_squeeze_ratio, settlement_price} = feeds[i][1][1];

        const publisher = await getUserName(feeds[i][0]);

        const core_exchange_rate_base = new Asset({...baseAsset, amount: core_exchange_rate.base.amount});
        const core_exchange_rate_quote = new Asset({...quoteAsset, amount: core_exchange_rate.quote.amount});

        const settlement_price_base = new Asset({...baseAsset, amount: settlement_price.base.amount});
        const settlement_price_quote = new Asset({...quoteAsset, amount: settlement_price.quote.amount});

        const mcr = new Asset({...baseAsset, amount: maintenance_collateral_ratio}).setPrecision();
        const mssr = new Asset({...baseAsset, amount: maximum_short_squeeze_ratio}).setPrecision();

        token = `${settlement_price_quote.symbol}/${settlement_price_base.symbol}`;

        priceFeedData.push({
            publisher: <Link to={`/user/${publisher}`}>{publisher}</Link>,
            settlementPrice: settlement_price_base.calculatePrice(settlement_price_quote),
            cer: core_exchange_rate_base.calculatePrice(core_exchange_rate_quote),
            mcr,
            mssr,
            time: formDate(time)
        })
    }

    const tableHead = [...defaultTableHead];
    tableHead[1].translateParams = {token};
    tableHead[2].translateParams = {token};

    return {priceFeedData, tableHead};
};

class PriceFeedData extends Component {
    state = {
        data: ''
    };

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.basicData.symbol !== nextProps.basicData.symbol) this.getData(nextProps);
    }

    getData = (params) => formPriceFeedData(params).then(data => this.setState({data}));

    render() {
        const {priceFeedData, tableHead} = this.state.data;
        return (
            <div className="fee-pool card">
                <CardHeader title={`block.${this.props.title}.title`}/>
                {
                    priceFeedData &&
                    <Table
                        tableHead={tableHead}
                        rows={priceFeedData}
                    />
                }
                <div className="card__footer">

                </div>
            </div>
        )
    }
}

export default PriceFeedData;