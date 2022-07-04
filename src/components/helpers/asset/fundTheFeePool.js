import React, {Component, Fragment} from "react";
import Input from "../form/input";
import {CardHeader} from "../cardHeader";
import Translate from "react-translate-component";
import Form from "../form/form";
import {getAccountData, getBasicAsset} from "../../../actions/store/index";
import {assetFundFeePool} from "../../../actions/forms/assetFundFeePool";
import {fetchAssetData} from "../../../actions/dataFetching";
import { utils } from "../../../utils";
import { updateAccountAndLoginData } from "../../../actions/account";

class FundTheFeePool extends Component {
    state = {
        sended: false,
        defaultData: false,
        userTokens: false
    };

    componentDidMount() {
        const user = getAccountData();
        const userTokens = user.assets;
        const basicAsset = getBasicAsset();
        const poolAssetSymbol = this.props.symbol
        const defaultData = {
            from: user.name,
            quantityAsset: basicAsset.symbol,
            fee: 0,
            feeAsset: basicAsset.symbol,
            quantity: '',
            poolAssetSymbol: poolAssetSymbol
        };

        this.setState({userTokens, defaultData});
    }

    handleFundTheFeePool = (data) => {
        const context = this;
        this.setState({sended: true}, () => {
            fetchAssetData();
            updateAccountAndLoginData();
            setTimeout(() => context.setState({sended: false}), 5000)
        });
    };

    render() {
        const title = this.props.title;
        const {defaultData, sended} = this.state;

        if (!defaultData) return <span/>;

        return (
            <div className="card card--action  cardresponsivediv ">
                <CardHeader title={`block.${title}.title`}/>
                <Translate component="div" className="card__comment" content={`block.${title}.text`} with={{poolAsset: this.props.symbol}} />
                <Form className="asset-action__content"
                      type={'asset_fund_fee_pool'}
                      defaultData={defaultData}
                      requiredFields={['from', 'quantity']}
                      action={assetFundFeePool}
                      handleResult={this.handleFundTheFeePool}
                      needPassword
                      keyType="active"
                >
                    {
                        form => {
                            const {errors, data, transactionError} = form.state;
                            return (
                                <Fragment>
                                    <div className="asset-action__row">
                                        <Input
                                            name="from"
                                            error={errors}
                                            value={data}
                                            disabled
                                        />
                                        <Input
                                            type="number"
                                            labelTag="exchangeForm.quantity"
                                            labelParams={{token: data.quantityAsset}}
                                            name="quantity"
                                            value={data}
                                            error={errors}
                                            className="asset-action__quantity"
                                            onChange={form.handleChange}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="btn__row">
                                        <span><Translate className="" content={`exchange.fee`} />: {data.fee} {data.feeAsset}</span>
                                        {sended && <span className="clr--positive"><Translate className="" content={`success.transCompleted}`} /></span>}
                                        {transactionError && transactionError !== "" ? 
                                            <span className="clr--negative">
                                                <Translate className="" content={`errors.${transactionError}`} />
                                            </span> 
                                            : ""}
                                        <button type="submit" className="btn-round btn-round--fund"><Translate className="" content={`exchange.fund`} /></button>
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

export default FundTheFeePool;