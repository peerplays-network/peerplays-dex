import React, {Component} from "react";
import {CardHeader} from "../../helpers/cardHeader";
import {Asset} from "../../../classes";

const infoElems = ['feedPrice', 'feedLifetime', 'minimumFeeds', 'maintenanceCollateralRatio', 'maximumShortSqueezeRatio'];

const formPriceFeed = async ({smartData, quoteAsset, baseAsset}) => {
    const {settlement_price, maintenance_collateral_ratio, maximum_short_squeeze_ratio} = smartData.current_feed;
    const {minimum_feeds, feed_lifetime_sec} = smartData.options;

    const newBaseAsset = new Asset({...baseAsset, amount: settlement_price.base.amount});
    const newQuoteAsset = new Asset({...quoteAsset, amount: settlement_price.quote.amount});

    return {
        feedPrice: {
            title: <Translate content="block.price.feedPrice"/>,
            text: isNaN(newBaseAsset.calculatePrice(newQuoteAsset)) ? '-' : `${newBaseAsset.calculatePrice(newQuoteAsset)} ${newBaseAsset.symbol}/${newQuoteAsset.symbol}`
        },
        feedLifetime: {
            title: <Translate content="block.price.feedLifetime"/>,
            text: feed_lifetime_sec / 60 / 60
        },
        minimumFeeds: {
            title: <Translate content="block.price.minimumFeeds"/>,
            text: minimum_feeds
        },
        maintenanceCollateralRatio: {
            title: <Translate content="block.price.maintenanceCollateralRatio"/>,
            text: Number(maintenance_collateral_ratio)/(10**3)
        },
        maximumShortSqueezeRatio: {
            title: <Translate content="block.price.maximumShortSqueezeRatio"/>,
            text: Number(maximum_short_squeeze_ratio)/(10**3)
        }
    }
};

class PriceFeed extends Component {
    state = {
        data: ''
    };

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.basicData.symbol !== nextProps.basicData.symbol) this.getData(nextProps);
    }

    getData = (params) => formPriceFeed(params).then(data => this.setState({data}));

    render() {
        const data = this.state.data;
        const title = this.props.title;

        return (
            <div className="fee-pool card">
                <CardHeader title={`block.${title}.title`}/>
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

export default PriceFeed;