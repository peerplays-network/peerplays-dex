import React, {Component, Fragment} from 'react';
import Input from "./form/input";
import Form from "./form/form";
import {sellBuy} from "../../actions/forms";
import {defaultQuote, defaultToken} from "../../params/networkParams";
import {getAccountData, getBasicAsset} from "../../actions/store";
import {dbApi} from "../../actions/nodes";
import FieldWithHint from "./form/fieldWithHint";
import except from "../../actions/assets/exceptAssetList";
import { utils } from '../../utils';
import Translate from 'react-translate-component';


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
        assets: false,
    };

    componentDidMount() {
        dbApi('list_assets', ['', 100]).then(assets => {
            this.setState({assets});
        })
        this.setBasicData();
    }

    setBasicData = () => {
        const userTokens = getAccountData().assets.map(e => e.symbol);
        const basicAsset = getBasicAsset().symbol;
        const defaultData = {
            sellAsset: userTokens && userTokens.length ? userTokens[0] : defaultToken,
            buyAsset: defaultQuote,
            feeAsset: basicAsset,
            fee: 0,
            amount_to_sell: 0,
            amount_to_receive: 0
        };

        this.setState({ userTokens, defaultData });
    };


    handleTransfer = () => {
        const context = this;
        this.setState({ sended: true }, () => {
            setTimeout(() => context.setState({sended: false}), 5000)
        });
        
        if(this.props.update) {
            this.props.update();
        }
    };

  

    render() {
        const {defaultData, userTokens, sended, assets} = this.state;
        
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
                    keyType="active"
                >
                    {
                        form => {
                            const {errors, data, transactionError} = form.state;
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
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                            precision={assets && assets.find(asset => asset.symbol === data.sellAsset).precision}
                                        />

                                        <FieldWithHint
                                            name="sellAsset"
                                            method={getUserAssetsList}
                                            hideLabel={true}
                                            handleChange={form.handleChange}
                                            errors={errors}
                                            defaultVal={data}
                                            defaultHints={userTokens}
                                            readOnly={true}
                                            hint={'asset'}

                                        />
   
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
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                            precision={assets && assets.find(asset => asset.symbol === data.buyAsset).precision}
                                        />

                                        <FieldWithHint
                                            name="buyAsset"
                                            method={getAssetsList}
                                            hideLabel={true}
                                            handleChange={form.handleChange}
                                            defaultVal={data}
                                            errors={errors}
                                            readOnly={true}
                                            hint={'asset'}
                                        />

                                    </div>
                                    <div className="info__row">
                                        <span className='clr--margin'><Translate className="" content={"field.labels.fee"} />{data.fee} {data.feeAsset}</span>
                                        {sended && <span className="clr--positive"><Translate content={"voting.trans"} /></span>}
                                        {transactionError && transactionError !== "" ? 
                                            <span className="clr--negative">
                                                <Translate className="" content={`errors.${transactionError}`} />
                                            </span> 
                                            : ""}
                                    </div>
                                    <div className="btn__row">
                                        <button className="btn-round btn-round--buy" onClick={form.submit}>
                                        <Translate className="" content={"quickSellBuy.buy"} />
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