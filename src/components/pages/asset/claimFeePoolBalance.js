import React, {Component, Fragment} from "react";
import {getAccountData, getBasicAsset} from "../../../actions/store";
import {CardHeader} from "../../helpers/cardHeader";
import Translate from "react-translate-component";
import Input from "../../helpers/form/input";
import Form from "../../helpers/form/form";
import {claimFeePoolBalance} from "../../../actions/forms/сlaimFeePoolBalance";
import { utils } from "../../../utils";

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
        this.setState({sended: true}, () => setTimeout(() => context.setState({sended: false}), 5000));
    };

    render() {
        const title = this.props.title;
        const {defaultData, sended} = this.state;

        if (!defaultData) return <span/>;

        return (
            <div className="card card--action">
                <CardHeader title={`block.${title}.title`}/>
                <Translate component="div" className="card__comment" content={`block.${title}.text`}/>
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
                                        <span>Fee: {data.fee} {data.quantityAsset}</span>
                                        {sended && <span className="clr--positive">Transaction Completed</span>}
                                        {transactionError && transactionError !== "" ? 
                                            <span className="clr--negative">
                                                <Translate className="" content={`errors.${transactionError}`} />
                                            </span> 
                                            : ""}
                                        <button type="submit" className="btn-round btn-round--fund">Claim</button>
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