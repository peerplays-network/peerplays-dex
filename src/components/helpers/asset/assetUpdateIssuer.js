import React, {Component, Fragment} from "react";
import {CardHeader} from "../cardHeader";
import Translate from "react-translate-component";
import {getAccountData, getBasicAsset, getFees} from "../../../actions/store/index";
import FieldWithHint from "../form/fieldWithHint";
import {dbApi} from "../../../actions/nodes/index";
import Form from "../form/form";
import {assetUpdateIssuer} from "../../../actions/forms/assetUpdateIssuer";
import {fetchAssetData} from "../../../actions/dataFetching";

const getSymbolsList = async (symbol) => dbApi('lookup_accounts', [symbol, 5])
    .then(result => result.map(e => e[0]));

class AssetUpdateIssuer extends Component {
    state = {
        sended: false,
        defaultData: false,
        userTokens: false
    };

    componentDidMount() {
        const user = getAccountData();
        const userTokens = user.assets;
        const basicAsset = getBasicAsset();

        let fees = getFees()['asset_update'];
        if (!fees.fee) fees = {fee: 100};

        const rawFee = fees.fee;

        let feeAmount = basicAsset.setPrecision(false, rawFee);

        const defaultData = {
            issuer: user.name,
            quantityAsset: basicAsset.symbol,
            fee: feeAmount,
            feeAsset: basicAsset.symbol,
            mainAsset: this.props.symbol,
            quantityAssetFees: 0,
            assetOwner: ''
        };

        this.setState({userTokens, defaultData, user});
    }

    handleAssetUpdateIssuer = (data) => {
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
                <Translate component="div" className="card__comment" content={`block.${title}.text`}/>
                <Form className="asset-action__content"
                      type={'asset_update_issuer'}
                      requiredFields={['assetOwner']}
                      action={assetUpdateIssuer}
                      defaultData={defaultData}
                      handleResult={this.handleAssetUpdateIssuer}
                      needPassword
                      keyType="owner"
                >
                    {
                        form => {
                            const {errors, data, transactionError} = form.state;
                            return(
                                <Fragment>
                                    <FieldWithHint
                                        name="assetOwner"
                                        method={getSymbolsList}
                                        handleChange={form.handleChange}
                                        defaultVal={data}
                                        errors={errors}
                                    />
                                    <div className="btn__row">
                                        <span><Translate className="" content={"tableHead.fee"} />: {data.fee} {data.quantityAsset}</span>
                                        {sended && <span className="clr--positive"><Translate className="" content={`success.transCompleted`} /></span>}
                                        {transactionError && transactionError !== "" ? 
                                            <span className="clr--negative">
                                                <Translate className="" content={`errors.${transactionError}`} />
                                            </span> 
                                            : ""}
                                        <button type="submit" className="btn-round btn-round--fund"><Translate className="" content={`actions.change}`} /></button>
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

export default AssetUpdateIssuer;