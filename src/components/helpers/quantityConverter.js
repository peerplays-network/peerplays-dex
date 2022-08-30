import React, {Component} from "react";
import Dropdown from "./form/dropdown";
import SelectHeader from "./selectHeader";
import {formAssetData} from "../../actions/assets";

export const formUserAssets = async (assetsList) => {

    let assets = await Promise.all(assetsList.map(async el => {
        const asset = await formAssetData(el);
        
        const symbol = asset.symbol;
        const amount = asset.setPrecision();

        return { amount,  symbol };
    }));

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