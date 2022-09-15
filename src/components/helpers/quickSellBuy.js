import React, {Component, Fragment} from 'react';
import Input from "./form/input";
import Form from "./form/form";
import {sellBuy} from "../../actions/forms";
import {defaultQuote, defaultToken} from "../../params/networkParams";
import {getAccountData} from "../../actions/store";
import {dbApi} from "../../actions/nodes";
import FieldWithHint from "./form/fieldWithHint";
import except from "../../actions/assets/exceptAssetList";

const getAssetsList = async () => dbApi('list_assets', ['', 100])
    .then(result => result.filter(e => !except.includes(e.symbol)).map(e => e.symbol));

const getUserAssetsList = async (symbol) =>  {
    if(getAccountData().assets && getAccountData().assets.length > 0) {
        return getAccountData().assets
        .filter(item => item ? item.symbol : [])
        .map(item => item.symbol)
    } else {
        return [defaultToken]
    }
};

class QuickSellBuy extends Component {
    state = {
        defaultData: false,
        userTokens: false,
        sended: false,
    };

    componentDidMount() {
        const userTokens = getAccountData().assets.map(e => e.symbol);
        const defaultData = {
            sellAsset: userTokens && userTokens.length ? userTokens[0] : defaultToken,
            buyAsset: defaultQuote,
            fee: 0,
            amount_to_sell: 0,
            amount_to_receive: 0
        };

        this.setState({userTokens, defaultData});
    }


    handleTransfer = (data) => {
        const context = this;
        this.setState({sended: true}, () => setTimeout(() => context.setState({sended: false}), 5000));
        window.location.reload();
        if(this.props.update) {
            this.props.update();
        }
        Array.from(document.querySelectorAll("input:not(:disabled):not([readonly]):not([type=hidden])" +
        ",textarea:not(:disabled):not([readonly])")).forEach(
            (input) => input.value = ""
        );
        
    };

  

    render() {
        const {defaultData, userTokens, sended} = this.state;

        if (!defaultData) return <span/>;

        return (
            <div className="card__content card__content--widget">
                <Form
                    type={'limit_order_create'}
                    className="form__sell-buy"
                    defaultData={defaultData}
                    requiredFields={['amount_to_sell', 'amount_to_receive', 'sellAsset', 'buyAsset']}
                    action={sellBuy}
                    handleResult={this.handleTransfer}
                    needPassword
                >
                    {
                        form => {
                            const {errors, data} = form.state;
                            return (
                                <Fragment>
                                    <div className="input__row">
                                        <Input
                                            name="amount_to_sell"
                                            labelTag="field.labels.sellAmount"
                                            type="number"
                                            min={0}
                                            onChange={form.handleChange}
                                            error={errors}
                                            defaultVal={data}
                                        />
                                        <div className="sellHint">
                                        <FieldWithHint
                                            name="sellAsset"
                                            method={getUserAssetsList}
                                            hideLabel={true}
                                            handleChange={form.handleChange}
                                            errors={errors}
                                            defaultVal={data}
                                            defaultHints={userTokens}
                                            readOnly={true}
                                        />
                                        </div>
                                    </div>
                                    <div className="input__row">
                                        <Input
                                            name="amount_to_receive"
                                            labelTag="field.labels.buyAmount"
                                            type="number"
                                            onChange={form.handleChange}
                                            error={errors}
                                            min={0}
                                            defaultVal={data}
                                        />
                                        <div className="sellHint">
                                        <FieldWithHint
                                            name="buyAsset"
                                            method={getAssetsList}
                                            hideLabel={true}
                                            handleChange={form.handleChange}
                                            defaultVal={data}
                                            errors={errors}
                                            readOnly={true}
                                        />
                                        </div>
                                    </div>
                                    <div className="info__row">
                                        <span>Fee: {data.fee} {data.sellAsset}</span>
                                        {sended && <span className="clr--positive">Transaction Completed</span>}
                                    </div>
                                    <div className="btn__row">
                                        <button className="btn-round btn-round--buy" onClick={form.submit}>
                                            Buy
                                        </button>
                                    </div>
                                </Fragment>
                            )
                        }
                    }
                </Form>
            </div>
        )
    }
}

export default QuickSellBuy;