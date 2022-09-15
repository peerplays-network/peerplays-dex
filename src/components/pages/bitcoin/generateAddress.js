import React, {Component,  Fragment} from "react";
import Translate from "react-translate-component";
import { getBasicAsset } from "../../../actions/store";
import Form from "../../helpers/form/form";
import Input from "../../helpers/form/input";
import {generateSidechainAddress} from "../../../actions/forms/generateSidechainAddress";
import { setSidechainAccounts } from "../../../dispatch/setAccount";

class GenerateAddress extends Component {
    state = {
        sended: false,
        defaultData: false,
    };

    componentDidMount() {
        const { sidechain } = this.props;
        const basicAsset = getBasicAsset().symbol;
        const defaultData = {
            depositPublicKey: '',
            withdrawPublicKey: '',
            withdrawAddress: '',
            sidechain: sidechain,
            fee: 0,
            feeAsset: basicAsset,
        };

        this.setState({ defaultData });
    }

    handleAddressGenerated = (data) => {
        Object.keys(data.map(({trx}) => {
            Object.keys(trx.operations.map((op) => {
                setSidechainAccounts([op[1]]);
            }))
        }))
        
        const context = this;
        window.location.reload();
        this.setState({sended: true}, () => setTimeout(() => context.setState({sended: false}), 5000));
    };


    render() {
        const {sended, defaultData} = this.state;

        if (!defaultData) return <span/>;
        return (
            <div className="card__content"> 
                <div className="form form--btc">
                    <Form
                        className="form__send"
                        type={'sidechain_address_add'}
                        defaultData={defaultData}
                        requiredFields={['depositPublicKey', 'withdrawPublicKey', 'withdrawAddress']}
                        action={generateSidechainAddress}
                        handleResult={this.handleAddressGenerated}
                        needPassword
                    >
                    {
                        form => {
                            const {errors, data} = form.state;

                            return (
                                <Fragment>
                                    <div className="input__row">
                                        <Input
                                            name="depositPublicKey"
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                        />
                                    </div>
                                    <div className="input__row">
                                        <Input
                                            name="withdrawPublicKey"
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                        />
                                        
                                    </div>
                                    <div className="input__row">
                                        <Input 
                                            name="withdrawAddress"
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                        />
                                    </div>
                                    <div className="btn__row">
                                        <span>
                                       </span>
                                        {sended && <Translate component="span" className="clr--positive" content={"success.sidechainGenerated"}/>}
                                        {errors === "ERROR" && <Translate component="span" className="clr--negative" content={"errors.sonError"}/>}
                                        {errors === "DUPLICATE" && <Translate component="h3" className="clr--negative" content={"errors.keyExists"}/>}
                                        <Translate className="btn-round btn-round--send" component="button" type="submit" content={"buttons.generate"}/>
                                    </div>
                                </Fragment>
                            )
                        }
                    }
                    </Form>
                </div>
            </div>
        );
    }
    
}

export default GenerateAddress;