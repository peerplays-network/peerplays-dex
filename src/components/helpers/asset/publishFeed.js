import React, {Component, Fragment} from "react";
import {CardHeader} from "../cardHeader";
import Form from "../form/form";
import Input from "../form/input";
import {getAccountData, getBasicAsset, getFees} from "../../../actions/store/index";
import {publishFeed} from "../../../actions/forms/publishFeed";
import {fetchAssetData} from "../../../actions/dataFetching";
import { utils } from "../../../utils";
import counterpart from "counterpart";

class PublishFeed extends Component {
    state = {
        data: false,
        sended: false,
        defaultData: false,
        userTokens: false
    };

    componentDidMount() {
        const user = getAccountData();
        const userTokens = user.assets;
        const basicAsset = getBasicAsset();

        const {core_exchange_rate, settlement_price, forceSettlementPrice, mcr, mssr, cer, assetSP} = this.props.data;

        let fees = getFees()['asset_update'];
        if (!fees.fee) fees = {fee: 100};

        const rawFee = fees.fee;

        let feeAmount = basicAsset.setPrecision(false, rawFee);

        const defaultData = {
            feedProducer: user.name,
            forceSettlementPrice: forceSettlementPrice.quote.calculatePrice(forceSettlementPrice.base),
            cer: cer.quote.calculatePrice(cer.base),
            mcr,
            mssr,
            feeAsset: basicAsset.symbol,
            fee: feeAmount,
            mainAsset: this.props.symbol,
            core_exchange_rate,
            settlement_price,
            assetSP
        };

        this.setState({userTokens, defaultData, user});
    }

    handlePublishFeed = (data) => {
        const context = this;
        this.setState({sended: true}, () => {
            fetchAssetData();
            setTimeout(() => context.setState({sended: false}), 5000)
        });
    };

    render() {
        const title = this.props.title;
        const {defaultData, sended} = this.state;

        if (!defaultData) return <span/>;

        return(
            <div className="card card--action__big">
                <CardHeader title={`block.${title}.title`}/>
                <div className="card__comment">{counterpart.translate(`block.${title}.text`)}</div>
                <Form className="asset-action__content"
                      type={'asset_publish_feed'}
                      defaultData={defaultData}
                      requiredFields={['forceSettlementPrice', 'cer', 'mcr', 'mssr']}
                      action={publishFeed}
                      handleResult={this.handlePublishFeed}
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
                                            name="feedProducer"
                                            value={data}
                                            error={errors}
                                            className="asset-action feedProducer"
                                            disabled
                                        />
                                        <Input
                                            type="number"
                                            name="forceSettlementPrice"
                                            value={data}
                                            error={errors}
                                            className="asset-action forceSettlementPrice"
                                            onChange={form.handleChange}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                        <Input
                                            type="number"
                                            name="cer"
                                            value={data}
                                            error={errors}
                                            className="asset-action forceSettlementPrice"
                                            onChange={form.handleChange}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                        <Input
                                            type="number"
                                            name="mcr"
                                            value={data}
                                            error={errors}
                                            className="asset-action small"
                                            onChange={form.handleChange}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                        <Input
                                            type="number"
                                            name="mssr"
                                            value={data}
                                            error={errors}
                                            className="asset-action small"
                                            onChange={form.handleChange}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="btn__row">
                                        <span>
                                            <span>{counterpart.translate(`field.labels.fee`)}</span>
                                            {data.fee} {data.feeAsset}
                                        </span>
                                        {sended && 
                                            <span className="clr--positive">
                                                <span>{counterpart.translate(`success.transCompleted`)}</span>
                                            </span>
                                        }
                                        {transactionError && transactionError !== "" ? 
                                            <span className="clr--negative">
                                                <span>{counterpart.translate(`errors.${transactionError}`)}</span>
                                            </span> 
                                            : ""
                                        }
                                        <button type="submit" className="btn-round btn-round--fund">Publish</button>
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

export default PublishFeed;