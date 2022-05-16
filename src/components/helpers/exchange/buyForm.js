import React, {Component, Fragment} from 'react';
import Form from "../form/form";
import UserBalance from "./userBalance";
import ControlledInput from "../form/controlledInput";
import Input from "../form/input";
import {sellBuy} from "../../../actions/forms";
import {roundNum} from "../../../actions/roundNum";
import Translate from "react-translate-component";
import {getBasicAsset} from "../../../actions/store";
import { getAssetBySymbol } from "../../../actions/assets"

const calcSell = ({price, amount_to_receive}) => `${roundNum(amount_to_receive * price)}`;
const calcReceive = ({price, amount_to_sell}) => `${roundNum(amount_to_sell / price)}`;
const calcPrice = ({amount_to_sell, amount_to_receive}) => `${roundNum(amount_to_receive / amount_to_sell)}`;

const mutations = {
    price: (data) => {
        if(data['amount_to_receive']){
            data['amount_to_sell'] = calcSell(data);
        } else if (data['amount_to_sell']){
            data['amount_to_receive'] = calcReceive(data);
        }
        return data;
    },
    amount_to_receive: (data) => {

        if (data['price']){
            data['amount_to_sell'] = calcSell(data);
        } else  if(data['amount_to_sell']){
            data['price'] = calcPrice(data);
        }

        return data;
    },
    amount_to_sell: (data) => {
        if (data['price']){
            data['amount_to_receive'] = calcReceive(data);
        } else if(data['amount_to_receive']){
            data['price'] = calcPrice(data);
        }
        return data;
    }
};
const formMutations = {
    price: (form) => {
        if(form['amount_to_receive'].value){
            form['amount_to_sell'].value = calcSell({
                price: form['price'].value,
                amount_to_receive: form['amount_to_receive'].value
            });
        } else if (form['amount_to_sell'].value){
            form['amount_to_receive'].value = calcReceive({
                price: form['price'].value,
                amount_to_sell: form['amount_to_sell'].value
            });
        }
    },
    amount_to_receive: (form) => {
        if (form['price'].value){
            form['amount_to_sell'].value = calcSell({
                price: form['price'].value,
                amount_to_receive: form['amount_to_receive'].value
            });
        } else  if(form['amount_to_sell'].value){
            form['price'].value = calcPrice({
                amount_to_sell: form['amount_to_sell'].value,
                amount_to_receive: form['amount_to_receive'].value
            });
        }
    },
    amount_to_sell: (form) => {
        if (form['price'].value){
            form['amount_to_receive'].value = calcReceive({
                price: form['price'].value,
                amount_to_sell: form['amount_to_sell'].value
            });
        } else if(form['amount_to_receive'].value){
            form['price'].value = calcPrice({
                amount_to_sell: form['amount_to_sell'].value,
                amount_to_receive: form['amount_to_receive'].value
            });
        }
    }
};
class BuyForm extends Component{

    state = {
        defaultData: false,
        precision: {
            sellAsset: 0,
            buyAsset: 0
        }
    };

    componentDidMount(){
        this.setBasicData();
    }

    componentWillReceiveProps(newProps){
        if(
            (!this.props.defaultData && newProps.defaultData)
            || newProps.defaultData && newProps.defaultData.quote !== this.props.defaultData.quote
        ) this.resetForm(newProps);
    }

    setBasicData = (newProps = {}) => {
        const {type, pair} = this.props;
        const sellAsset = pair.base.symbol;
        const buyAsset = pair.quote.symbol;
        const basicAsset = getBasicAsset();

        const defaultData = { type, sellAsset, buyAsset, fee: 0, feeAsset: basicAsset.symbol };

        if(newProps.defaultData){
            const {quote, base, price} = newProps.defaultData;
            defaultData.price = price;
            defaultData.amount_to_receive = quote;
            defaultData.amount_to_sell = base;
        }

        this.setState({defaultData});
        (async (obj) => {
            const { precision: sellAssetPrecision } = await getAssetBySymbol(sellAsset)
            const { precision: buyAssetPrecision } = await getAssetBySymbol(buyAsset)
            obj.setState({
                precision: {
                    sellAsset: sellAssetPrecision,
                    buyAsset: buyAssetPrecision
                }
            })
        })(this)  
    };

    resetForm = (props) => this.setState({defaultData: false}, () => { this.setBasicData(props) });

    render(){
        const type = this.props.type;
        const defaultData = this.state.defaultData;

        if(!defaultData) return <span />;

        const isBuy = type === 'buy';

        return(
            <Form
                type="limit_order_create"
                defaultData={defaultData}
                requiredFields={['price','amount_to_sell', 'amount_to_receive']}
                requiredQuantity = {['amount_to_receive']}
                mutateData={mutations}
                action={sellBuy}
                handleResult={this.resetForm}
                orderConfirmation
            >
                {
                    form => {
                        const {errors, data} = form.state;
                        const handleChange = (value, name) => {
                            if(name === 'price' || name === 'amount_to_receive') {
                                const fractionLength = value.indexOf('.') === -1 
                                                        ? 0 
                                                        : (value.length - value.indexOf('.') - 1)
                                const {sellAsset, buyAsset} = this.state.precision
                                const precision = name === 'price' ? sellAsset : buyAsset
                                if (fractionLength > precision)
                                    form.form[name].value = parseFloat(value).toFixed(precision).toString()
                            }
                            formMutations[name](form.form)
                            form.handleChange(value, name)
                        }

                        return (
                            <Fragment>
                                <Input
                                    id={`${type}-price`}
                                    name="price"
                                    type="number"
                                    min={0}
                                    labelTag="exchangeForm.price"
                                    labelParams={{token: defaultData.sellAsset}}
                                    className="with-border"
                                    onChange={handleChange}
                                    value={data}
                                    error={errors}
                                />
                                <Input
                                    id={`${type}-receive`}
                                    name="amount_to_receive"
                                    type="number"
                                    min={0}
                                    labelTag="exchangeForm.quantity"
                                    labelParams={{token: defaultData.buyAsset}}
                                    className="with-border"
                                    onChange={handleChange}
                                    value={data}
                                    error={errors}
                                />
                                <Input
                                    id={`${type}-sell`}
                                    name="amount_to_sell"
                                    type="number"
                                    min={0}
                                    labelTag="exchangeForm.total"
                                    labelParams={{token: defaultData.sellAsset}}
                                    className="with-border"
                                    onChange={handleChange}
                                    value={data}
                                    error={errors}
                                    readOnly={true}
                                    disabled={true}
                                    style={{cursor:"text"}}
                                />
                               
                                <div className="exchange-form__info-wrapper">
                                    <div className="exchange-form__info">
                                        <Translate content="exchange.fee" />
                                        <span>{data.fee} {data.feeAsset}</span>
                                    </div>
                                    <div className="exchange-form__info">
                                        <Translate content="exchange.marketFee" percent={'0.1'} />
                                        <span>0 {data.sellAsset}</span>
                                    </div>
                                    <UserBalance assetSymbol={isBuy ? data.sellAsset : data.buyAsset}  />
                                </div>
                                <button className="btn-round btn-round--buy" onClick={form.submit}>
                                    <Translate content={`exchange.${isBuy ? 'buy' : 'sell'}`} /> {data.buyAsset}
                                </button>
                            </Fragment>
                        )
                    }
                }
            </Form>
        )
    }
}

export default BuyForm;
