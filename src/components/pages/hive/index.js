import React, {Component,  Fragment} from "react";
import Translate from "react-translate-component";
import { Card } from "../../helpers/card";
import { CardHeader } from "../../helpers/cardHeader";
import Grid from '@material-ui/core/Grid';
import {  getAccountData, getBasicAsset } from "../../../actions/store";
import Form from "../../helpers/form/form";
import Input from "../../helpers/form/input";
import {transfer} from "../../../actions/forms"
import FieldWithHint from "../../helpers/form/fieldWithHint";


const getHiveAssetsList = async (symbol) => {
    return ['HIVE', 'HBD']
}


class HiveTransactions extends Component {
    state = {
        sended: false,
        defaultData: false,
    };

    componentDidMount() {
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
        window.location.reload();
        this.setState({sended: true}, () => setTimeout(() => context.setState({sended: false}), 5000));

        if(this.props.update) {
            this.props.update();
        }
    };


    render() {
        const {sended, defaultData} = this.state;

        if (!defaultData) return <span/>;
        return (
            <div className="container">
                <div className="page__header-wrapper">
                    <Translate className="page__title" component="h1" content={"hive.title"}/>
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
                                    >
                                    {
                                        form => {
                                            const {errors, data} = form.state;
                
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
                                                        <span><Translate component="span" content={"field.labels.fee"}/>: {data.fee} {data.feeAsset}</span>
                                                        {sended && <Translate className="clr--positive" component="span" content={"success.transCompleted"}/> }
                                                        <Translate className="btn-round btn-round--send" component="button" type="submit" content={"buttons.withdraw"}/>
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