import React, {Component, Fragment} from "react";
import {getAccountData, getBasicAsset} from "../../../actions/store/index";
import {CardHeader} from "../cardHeader";
import Input from "../form/input";
import Form from "../form/form";
import {claimFeePoolBalance} from "../../../actions/forms/сlaimFeePoolBalance";
import {fetchAssetData} from "../../../actions/dataFetching";
import { utils } from "../../../utils";
import counterpart from "counterpart";

class ClaimFeePoolBalance extends Component {
    state = {
        sended: false,
        defaultData: false,
        userTokens: false
    };

    componentDidMount() {
        const user = getAccountData();
        const userTokens = user.assets;
        const basicAsset = getBasicAsset();

        const defaultData = {
            from: user.name,
            quantityAsset: basicAsset.symbol,
            fee: 0,
            feeAsset: basicAsset.symbol,
            mainAsset: this.props.symbol,
            quantityClaim: 0
        };

        this.setState({userTokens, defaultData});
    }

    handleClaimFeePoolBalance = (data) => {
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

        return (
            <div className="card card--action">
                <CardHeader title={`block.${title}.title`}/>
                <div className="card__comment">{counterpart.translate(`block.${title}.text`)}</div>
                <Form className="asset-action__content"
                      type={'asset_claim_pool'}
                      defaultData={defaultData}
                      requiredFields={['quantityClaim']}
                      action={claimFeePoolBalance}
                      handleResult={this.handleClaimFeePoolBalance}
                      needPassword
                      keyType="active"
                >
                    {
                        form => {
                            const {errors, data, transactionError} = form.state;
                            return (
                                <Fragment>
                                    <Input
                                        type="number"
                                        labelTag="exchangeForm.quantity"
                                        labelParams={{token: data.quantityAsset}}
                                        name="quantityClaim"
                                        value={data}
                                        error={errors}
                                        className="asset-action"
                                        onChange={form.handleChange}
                                        onKeyPress={(e) => {
                                            if (!utils.isNumberKey(e)) {
                                              e.preventDefault();
                                            }
                                        }}
                                    />
                                    <div className="btn__row">
                                        <span>
                                            <span>
                                                {counterpart.translate(`field.labels.fee`)}
                                            </span>
                                            {data.fee} {data.quantityAsset}
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
                                            : ""}
                                        <button type="submit" className="btn-round btn-round--fund">
                                            <span>{counterpart.translate(`actions.claim`)}</span>
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

export default ClaimFeePoolBalance;