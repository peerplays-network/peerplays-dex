import React, {Component, Fragment} from "react";
import Input from "../../helpers/form/input";
import Translate from "react-translate-component";
import {updateSidechainAddress} from "../../../actions/forms/updateSidechainAddress";
import {setSidechainAccounts} from '../../../dispatch/setAccount';
import Form from "../../helpers/form/form";
import { getBasicAsset } from "../../../actions/store";

class UpdateAddress extends Component {
    state = {
        updated: false,
        defaultData: false,
    };
    
    componentDidMount() {
        const basicAsset = getBasicAsset().symbol;
        const {sidechain, sidechainAccount} = this.props;
        const defaultData = {
            fee: 0,
            feeAsset: basicAsset,
            sidechainAddressId: sidechainAccount.id,
            sidechain,
            depositPublicKey: sidechainAccount.deposit_public_key,
            depositAddress: sidechainAccount.deposit_address,
            depositAddressData: sidechainAccount.deposit_address_data,
            withdrawPublicKey: sidechainAccount.withdraw_public_key,
            withdrawAddress: sidechainAccount.withdraw_address  
        }
        this.setState({ defaultData });
    }

    handleAddressUpdated = (data) => {
        Object.keys(data.map(({trx}) => {
            Object.keys(trx.operations.map((op) => {
                setSidechainAccounts([op[1]]);
            }))
        }))
        const context = this;
        window.location.reload();
        this.setState({updated: true}, () => setTimeout(() => context.setState({updated: false}), 5000));
    };
    
    render() {
        const {updated, defaultData} = this.state;
        if (!defaultData) return <span/>;

        return(
            <div className="card__content">
                <Form
                    type={'sidechain_address_delete'}
                    className='form--btc form--btc__widget'
                    defaultData={defaultData}
                    requiredFields={['withdrawPublicKey', 'withdrawAddress']}
                    action={updateSidechainAddress}
                    handleResult={this.handleAddressUpdated}
                    needPassword>
                {
                    form => {
                        const {errors, data} = form.state;
                        return (
                            <Fragment>                            
                                <Input 
                                    name="withdrawPublicKey" 
                                    className="modal__field"
                                    onChange={form.handleChange}
                                    error={errors}
                                    value={data}/>
                                <Input 
                                    name="withdrawAddress" 
                                    className="modal__field" 
                                    onChange={form.handleChange}
                                    error={errors}
                                    value={data}/>
                                <div className="info__row">
                                    <span><Translate component="span" content={"field.labels.fee"}/>: {data.fee} {data.feeAsset}</span>
                                    {errors === "ERROR" && <Translate component="span" className="clr--negative" content={"errors.sonError"}/>}
                                    {errors === "DUPLICATE" && <Translate component="h3" className="clr--negative" content={"errors.keyExists"}/> }
                                    {updated && <Translate component="span" className="clr--positive" content={"success.sidechainUpdated"}/> }
                                </div>
                                <div className="btn__row">
                                    <Translate className="btn-round btn-round--buy" component="button" type="submit" content={"buttons.update"}/>
                                </div>
                            </Fragment>
                        )
                    }
                }
                </Form>
            </div>
        )
    }

};

export default UpdateAddress;