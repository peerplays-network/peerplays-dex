import React, {Component,  Fragment} from "react";
import { Card } from "../../helpers/card";
import { CardHeader } from "../../helpers/cardHeader";
import {  getAccountData, getBasicAsset, getStore } from "../../../actions/store";
import Form from "../../helpers/form/form";
import Input from "../../helpers/form/input";
import {transfer} from "../../../actions/forms"
import FieldWithHint from "../../helpers/form/fieldWithHint";
import { utils } from "../../../utils";
import {  updateAccountAndLoginData } from "../../../actions/account";
import { dbApi } from "../../../actions/nodes";
import counterpart from "counterpart";



const getHiveAssetsList = async (symbol) => {
    return ['HIVE', 'HBD']
}


class HiveTransactions extends Component {
    state = {
        sended: false,
        defaultData: false,
        assets: false
    };

    update = updateAccountAndLoginData

    componentDidMount() {
        dbApi('list_assets', ['', 100]).then(assets => {
            this.setState({assets})
        })
        const user = getAccountData();
        const startAsset = 'HIVE';
        const basicAsset = getBasicAsset().symbol;
        const defaultData = {
            from: user.name,
            quantityAsset: startAsset,
            fee: 0,
            feeAsset: basicAsset,
            quantity: 0,
            memo: '',
            to: 'son-account'
        };

        this.setState({ defaultData });
    }

    handleTransfer = (data) => {
        const context = this;
        this.setState({sended: true}, () => setTimeout(() => context.setState({sended: false}), 5000));

        this.update();
    };


    render() {
        const {sended, defaultData, assets} = this.state;

        if (!defaultData) return <span/>;
        return (
            <div className="container">
                <div className="page__header-wrapper">
                    <h1 className="page__title">{counterpart.translate(`hive.title`)}</h1>
                </div>
                <div>
                    <div className="graphs" style={{justifyContent: "center"}}>
                        <Card mode={"hive-withdraw"}>
                            <CardHeader title={"hive.cardTitle"} />
                            <div className="card__content"> 
                                <div className="form form--btc">
                                    <Form
                                        type={'transfer'}
                                        className="form__send"
                                        defaultData={defaultData}
                                        requiredFields={['to', 'quantity', 'memo']}
                                        action={transfer}
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
                                                            style={{"display": "none"}}
                                                            name="from"
                                                            onChange={form.handleChange}
                                                            error={errors}
                                                            value={data}
                                                            disabled
                                                        />
                                                        <Input
                                                            labelTag="field.labels.hiveAmount" 
                                                            name="quantity"
                                                            type="number"
                                                            onChange={form.handleChange}
                                                            error={errors}
                                                            value={data}
                                                            onKeyPress={(e) => {
                                                                if (!utils.isNumberKey(e)) {
                                                                  e.preventDefault();
                                                                }
                                                            }}
                                                            precision={assets && assets.find(asset => asset.symbol === data.quantityAsset).precision}
                                                        />
                                                    </div>
                                                    <div className="input__row">
                                                        <Input
                                                            style={{"display": "none"}}
                                                            name="to"
                                                            disabled
                                                            onChange={form.handleChange}
                                                            error={errors}
                                                            value={data}
                                                        />
                                                        
                                                        <FieldWithHint
                                                            name="quantityAsset"
                                                            method={getHiveAssetsList}
                                                            id="form"
                                                            labelTag="field.labels.hiveCurrency" 
                                                            handleChange={form.handleChange}
                                                            errors={errors}
                                                            defaultVal = {data}
                                                            readOnly={true}
                                                        />
                                                    </div>
                                                    <div className="input__row">
                                                        <Input
                                                            labelTag="field.labels.hiveAcc"   
                                                            name="memo"
                                                            onChange={form.handleChange}
                                                            error={errors}
                                                            value={data}
                                                        />
                                                    </div>
                                                    <div className="btn__row">
                                                        <span>
                                                            <span>{counterpart.translate(`field.labels.fee`)}</span>
                                                            {data.fee} {data.feeAsset}
                                                        </span>
                                                        {sended &&
                                                            <span className="clr--positive">{counterpart.translate(`success.transCompleted`)}</span> 
                                                        }
                                                        {transactionError && transactionError !== "" ? 
                                                            <span className="clr--negative">
                                                                <span>{counterpart.translate(`errors.${transactionError}`)}</span>
                                                            </span> 
                                                            : ""
                                                        }
                                                        <button 
                                                            className="btn-round btn-round--send"
                                                            type="submit"
                                                        >
                                                            {counterpart.translate(`buttons.withdraw`)}
                                                        </button>
                                                    </div>
                                                </Fragment>
                                            )
                                        }
                                    }
                                    </Form>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
    
}


export default HiveTransactions