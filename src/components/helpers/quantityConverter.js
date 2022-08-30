import React, {Component} from "react";
import Dropdown from "./form/dropdown";
import SelectHeader from "./selectHeader";
import {dbApi} from "../../actions/nodes";
import {defaultQuote} from "../../params/networkParams";
import {formAssetData, getAsset, setPrecision} from "../../actions/assets";
import {roundNum} from "../../actions/roundNum";
import {Asset} from "../../classes";
import {getFullAccount} from "../../actions/account";

export const formQuantity = async (list, assetSymbol = defaultQuote) => {
    let quantity = 0;
    return await Promise.all(list.map(async asset => {
        const price = assetSymbol === asset.symbol ? 1 : await dbApi('get_ticker', [assetSymbol, asset.symbol]).then(e => e.latest);
        quantity = quantity + (price * asset.amount);
    })).then(() => roundNum(quantity));
};

export const formUserAssets = async (assetsList) => {

    // const defaultQuoteData = {amount: 0, symbol: defaultQuote};

    // let haveDefaultQuote = false;

    let assets = await Promise.all(assetsList.map(async el => {
        const asset = await formAssetData(el);
        
        const symbol = asset.symbol;
        const amount = asset.setPrecision();

        // if(symbol === defaultQuote) haveDefaultQuote = true;

        return { amount,  symbol };
    }));

    // if(!haveDefaultQuote) assets.unshift(defaultQuoteData);

    return assets;
};

class QuantityConverter extends Component{
    state = {
        assetsList: false,
        quantity: 0,
        selectedAsset: 0
    };

    componentDidMount(){
        this.formData(this.props);
    }

    componentWillReceiveProps(props){
        this.formData(props);
    }

    shouldComponentUpdate(nextProps, nextState){
        return nextProps.name !== this.props.name || nextState.quantity !== this.state.quantity;
    }

    formData = (props) => formUserAssets(props.assets).then(assetsList => {
        this.setState({assetsList, quantity: assetsList[this.state.selectedAsset].amount});
    });

    changeQuantity = (id) => {
        const selectedAsset = id;
        const assetsList = this.state.assetsList;
        this.setState({selectedAsset, quantity: assetsList[id].amount})
    };

    render(){

        const assetsList = this.state.assetsList;

        if(!assetsList) return <span />;

        const {quantity, selectedAsset} = this.state;

        return(
            <div className="quantity-converter">
                <span className="quantity-converter__summ">{ quantity }</span>
                <div className="quantity-dropdownLabel">
                <Dropdown
                    btn={<SelectHeader text={assetsList[selectedAsset].symbol} />}
                    list={assetsList.map((el, id) => (
                        <button key={id} onClick={() => this.changeQuantity(id)}>{el.symbol}</button>
                    ))}
                />
                </div>
            </div>
        )
    }
}

export default QuantityConverter;