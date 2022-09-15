import React, {Component, Fragment} from "react";
import {CardHeader} from "../../helpers/cardHeader";
import Translate from "react-translate-component";
import Form from "../../helpers/form/form";
import Input from "../../helpers/form/input";
import {getAccountData, getBasicAsset, getFees} from "../../../actions/store";
import { utils } from "../../../utils";

class BidCollateral extends Component {
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
            feedProducer: user.name,
            feeAsset: basicAsset.symbol,
            fee: feeAmount,
            mainAsset: this.props.symbol,
            debt: 0,
            collateral: 0
        };

        this.setState({userTokens, defaultData, user});
    }

    handleBidCollateral = (data) => {
        const context = this;
        this.setState({sended: true}, () => setTimeout(() => context.setState({sended: false}), 5000));
    };

    render() {
        const title = this.props.title;
        const {defaultData, sended} = this.state;

        if (!defaultData) return <span/>;

        return(
            <div className="card card--action__big">
                <CardHeader title={`block.${title}.title`}/>
                <Translate component="div" className="card__comment card__comment--negative" content={`block.${title}.text`}/>
                <div className="card__footer"/>
                <Form className="asset-action__content"
                      type={'asset_publish_feed'}
                      defaultData={defaultData}
                      requiredFields={['collateral', 'debt']}
                      // action={publishFeed}
                      handleResult={this.handleBidCollateral}
                      needPassword
                >
                    {
                        form => {
                            const {errors, data} = form.state;
                            return (
                                <Fragment>
                                    <div className="asset-action__row">
                                        <Input
                                            type="number"
                                            name="collateral"
                                            value={data}
                                            error={errors}
                                            labelParams={{token: data.mainAsset}}
                                            className="asset-action"
                                            onChange={form.handleChange}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                        />
                                        <Input
                                            type="number"
                                            name="debt"
                                            value={data}
                                            error={errors}
                                            labelParams={{token: data.mainAsset}}
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
                                        <span><Translate className="" content={"tableHead.fee"} />: {data.fee} {data.quantityAsset}</span>
                                        {sended && <span className="clr--positive"><Translate className="" content={`success.transCompleted`} /></span>}
                                        <button type="submit" className="btn-round btn-round--fund"><Translate className="" content={`actions.publish}`} /></button>
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

export default BidCollateral;