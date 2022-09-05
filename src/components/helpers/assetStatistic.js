import React, {Component} from "react";
import {getUserName} from "../../actions/account";
import {Asset} from "../../classes";
import {getBasicAsset} from "../../actions/store";
import counterpart from "counterpart";

const infoElems = ['type', 'issuer', 'precision', 'backingAsset', 'currentSupply', 'stealthSupply', 'maxFee', 'maxSupply'];

const formAssetStatistic = async ({basicData, dynamicData, baseAsset, quoteAsset = getBasicAsset()}) => {
    const {bitasset_data_id, precision} = basicData;
    const {current_supply, confidential_supply} = dynamicData;
    const {max_market_fee, max_supply} = basicData.options;

    const type = bitasset_data_id ? 'smart' : 'simple';
    const issuer = await getUserName(basicData.issuer);
    const defaultAsset = new Asset({precision});

    return {
        type: {
            title: <span>{counterpart.translate(`block.general.type`)}</span>,
            text: type
        },
        precision: {
            title: <span>{counterpart.translate(`block.general.precision`)}</span>,
            text: precision
        },
        issuer: {
            title: <span>{counterpart.translate(`block.general.issuer`)}</span>,
            text: issuer
        },
        backingAsset: {
            title: <span>{counterpart.translate(`block.general.backingAsset`)}</span>,
            text: quoteAsset.symbol
        },
        currentSupply: {
            title: <span>{counterpart.translate(`block.general.currentSupply`)}</span>,
            text: defaultAsset.setPrecision(true, current_supply)
        },
        stealthSupply: {
            title: <span>{counterpart.translate(`block.general.stealthSupply`)}</span>,
            text: defaultAsset.setPrecision(true, confidential_supply)
        },
        maxFee: {
            title: <span>{counterpart.translate(`block.general.maxFee`)}</span>,
            text: defaultAsset.setPrecision(true, max_market_fee)
        },
        maxSupply: {
            title: <span>{counterpart.translate(`block.general.maxSupply`)}</span>,
            text: defaultAsset.setPrecision(true, max_supply)
        }
    };
};

class AssetStatistic extends Component {
    state = {
        data: ''
    };

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.basicData.symbol !== nextProps.basicData.symbol) this.getData(nextProps);
    }

    getData = (params) => formAssetStatistic(params).then(data => this.setState({data}));

    render() {
        const {data} = this.state;

        return (
            <div className="asset-stats card">
                {this.props.title}
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
};

export default AssetStatistic;