import React, {Component, Fragment} from "react";
import {CardHeader} from "../../helpers/cardHeader";
import Form from "../../helpers/form/form";
import Input from "../../helpers/form/input";
import {getAccountData, getBasicAsset} from "../../../actions/store";
import {assetClaimFees} from "../../../actions/forms/assetClaimFees";
import { utils } from "../../../utils";

class AssetClaimFees extends Component {
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
            quantityAssetFees: 0
        };

        this.setState({userTokens, defaultData});
    }

    handleAssetClaimFees = (data) => {
        const context = this;
        this.setState({sended: true}, () => setTimeout(() => context.setState({sended: false}), 5000));
    };

    render() {
        const title = this.props.title;
        const {defaultData, sended} = this.state;

        if (!defaultData) return <span/>;
        return(
            <div className="card card--action">
                <CardHeader title={`block.${title}.title`}/>
                <Translate component="div" className="card__comment" content={`block.${title}.text`}/>
                <Form className="asset-action__content"
                      type={'asset_claim_fees'}
                      defaultData={defaultData}
                      requiredFields={['quantityAssetFees']}
                      action={assetClaimFees}
                      handleResult={this.handleAssetClaimFees}
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
                                        labelParams={{token: data.mainAsset}}
                                        name="quantityAssetFees"
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
                                        <span><Translate className="" content={"field.labels.fee"} />{data.fee} {data.quantityAsset}</span>
                                        {sended && <span className="clr--positive"><Translate className="" content={`success.transCompleted`} /></span>}
                                        {transactionError && transactionError !== "" ? 
                                            <span className="clr--negative">
                                                <Translate className="" content={`errors.${transactionError}`} />
                                            </span> 
                                            : ""}
                                        <button type="submit" className="btn-round btn-round--fund"><Translate className="" content={`actions.claim}`} /></button>
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

export default AssetClaimFees;