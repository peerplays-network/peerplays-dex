import React, {Component, Fragment} from 'react';
import Form from "../form/form";
import UserBalance from "./userBalance";
import ControlledInput from "../form/controlledInput";
import Input from "../form/input";
import {sellBuy} from "../../../actions/forms";
import {roundNum} from "../../../actions/roundNum";
import Translate from "react-translate-component";
import {getBasicAsset} from "../../../actions/store";
import { utils } from '../../../utils';
import { getAssetBySymbol } from "../../../actions/assets"
import { dbApi } from '../../../actions/nodes';


class BuyForm extends Component{

    state = {
        defaultData: false,
        precision: {
            sellAsset: 0,
            buyAsset: 0
        },
        assets: false
    };

    componentDidMount(){
        dbApi('list_assets', ['', 100]).then(assets => {
            this.setState({assets})
        })
        this.setBasicData();
    }

    componentWillReceiveProps(newProps){
        if(
            (!this.props.defaultData && newProps.defaultData)
            || (this.props.pair.base.symbol !== newProps.pair.base.symbol || this.props.pair.quote.symbol !== newProps.pair.quote.symbol) 
        ){
            this.resetForm(newProps);
        } 
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


    calcSell = ({price, amount_to_receive}) => `${roundNum(amount_to_receive * price, this.state.precision.sellAsset)}`;
    calcReceive = ({price, amount_to_sell}) => `${roundNum(amount_to_sell / price, this.state.precision.buyAsset)}`;
    calcPrice = ({amount_to_sell, amount_to_receive}) => `${roundNum((amount_to_receive / amount_to_sell), this.state.precision.sellAsset)}`;

    mutations = {
        price: (data) => {
            if(data['amount_to_receive']){
                data['amount_to_sell'] = this.calcSell(data);
            } else if (data['amount_to_sell']){
                data['amount_to_receive'] = this.calcReceive(data);
            }
            return data;
        },
        amount_to_receive: (data) => {

            if (data['price']){
                data['amount_to_sell'] = this.calcSell(data);
            } else  if(data['amount_to_sell']){
                data['price'] = this.calcPrice(data);
            }

            return data;
        },
        amount_to_sell: (data) => {
            if (data['price']){
                data['amount_to_receive'] = this.calcReceive(data);
            } else if(data['amount_to_receive']){
                data['price'] = this.calcPrice(data);
            }
            return data;
        }
    };
    formMutations = {
        price: (form) => {
            if(form['amount_to_receive'].value){
                form['amount_to_sell'].value = this.calcSell({
                    price: form['price'].value,
                    amount_to_receive: form['amount_to_receive'].value
                });
            } else if (form['amount_to_sell'].value){
                form['amount_to_receive'].value = this.calcReceive({
                    price: form['price'].value,
                    amount_to_sell: form['amount_to_sell'].value
                });
            }
        },
        amount_to_receive: (form) => {
            if (form['price'].value){
                form['amount_to_sell'].value = this.calcSell({
                    price: form['price'].value,
                    amount_to_receive: form['amount_to_receive'].value
                });
            } else if(form['amount_to_sell'].value){
                form['price'].value = this.calcPrice({
                    amount_to_sell: form['amount_to_sell'].value,
                    amount_to_receive: form['amount_to_receive'].value
                });
            }
        },
        amount_to_sell: (form) => {
            if (form['price'].value){
                form['amount_to_receive'].value = this.calcReceive({
                    price: form['price'].value,
                    amount_to_sell: form['amount_to_sell'].value
                });
            } else if(form['amount_to_receive'].value){
                form['price'].value = this.calcPrice({
                    amount_to_sell: form['amount_to_sell'].value,
                    amount_to_receive: form['amount_to_receive'].value
                });
            }
        }
    };

    resetForm = (props) => {
        this.setState({ defaultData: false }, () => { this.setBasicData(props) });

         if(this.props.update) {
            this.props.update();
        }
    }

    render(){
        const type = this.props.type;
        const defaultData = this.state.defaultData;
        const assets = this.state.assets
        if(!defaultData) return <span />;

        const isBuy = type === 'buy';

        return(
            <Form
                type="limit_order_create"
                defaultData={defaultData}
                requiredFields={['price','amount_to_sell', 'amount_to_receive']}
                requiredQuantity = {['amount_to_receive']}
                mutateData={this.mutations}
                action={sellBuy}
                handleResult={this.resetForm}
                orderConfirmation
                keyType="active"
            >
                {
                    form => {
                        const {errors, data, transactionError} = form.state;
                        const handleChange = (value, name) => {
                            this.formMutations[name](form.form)
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
                                    onKeyPress={(e) => {
                                        if (!utils.isNumberKey(e)) {
                                          e.preventDefault();
                                        }
                                    }}
                                    precision={assets && assets.find(asset => asset.symbol === data.sellAsset).precision}
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
                                    onKeyPress={(e) => {
                                        if (!utils.isNumberKey(e)) {
                                          e.preventDefault();
                                        }
                                    }}
                                    precision={assets && assets.find(asset => asset.symbol === data.buyAsset).precision}
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
                                    precision={assets && assets.find(asset => asset.symbol === data.sellAsset).precision}
                                />
                               
                                <div className="exchange-form__info-wrapper">
                                    <div className="exchange-form__info">
                                        <Translate content="exchange.fee" />
                                        <span>{data.fee} {data.feeAsset}</span>
                                    </div>
                                    <div className="exchange-form__info">
                                        <Translate content="exchange.marketFee" percent={'0.1'} />
                                        {type === 'buy' ? <span>{`${data.buyMarketFeePercent ? data.buyMarketFeePercent : 0}%`}</span> : 
                                            <span>{`${data.sellMarketFeePercent ? data.sellMarketFeePercent : 0}%`}</span>}
                                    </div>
                                    <UserBalance assetSymbol={isBuy ? data.sellAsset : data.buyAsset}  />
                                </div>
                                <div className="info__row">
                                    {transactionError && transactionError !== "" ? 
                                        <span className="clr--negative">
                                            <Translate className="" content={`errors.${transactionError}`} />
                                        </span> 
                                        : ""}
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
