import React, {Component, Fragment} from "react";
import Form from "../../form/form";
import Input from "../../form/input";
import Close from "../decoration/close";
import {generateSidechainAddress} from "../../../../actions/forms/generateSidechainAddress";
import Submit from "../decoration/submit";
import ModalTitle from "../decoration/modalTitle";
import { setSidechainAccounts } from '../../../../dispatch/setAccount';
import { removeModal } from '../../../../dispatch/setModal';
import {clearLayout} from "../../../../dispatch/index";
import { updateAccountAndLoginData } from "../../../../actions/account";
import Translate from "react-translate-component";


class GenerateAddress extends Component {
  state = {
    sended: false,
    defaultData: {
      sidechain: this.props.sidechain,
      depositPublicKey: '',
      password: this.props.password,
      keyType: this.props.keyType,
      withdrawPublicKey: '',
      withdrawAddress: '',
      fee: 0
    }
  };

  handleAddressGenerated = (data) => {
    Object.keys(data.map(({trx}) => {
        console.log(trx);  
        Object.keys(trx.operations.map((op) => {
            console.log(op[1]);
            setSidechainAccounts([op[1]]);
        }))
    }))
    
    this.setState({sended: true}, () => {
    });
    updateAccountAndLoginData();

    setTimeout(() => {
        clearLayout();
    }, 5000);
};

  render() {
    const {defaultData, sended} = this.state;
    const {sidechain} = this.props;

    return (
        <Fragment>
            <ModalTitle tag="generateAddress" additionalData={{sidechain}}/>
            <Form
                type={'sidechain_address_add'}
                requiredFields={['depositPublicKey', 'withdrawPublicKey', 'withdrawAddress']}
                defaultData={defaultData}
                action={generateSidechainAddress}
                handleResult={this.handleAddressGenerated}
            >
                {
                    form => {
                        const {errors, transactionError} = form.state;
                        return (
                    <Fragment>
                        <div className="modal__content">
                            <Input
                                name="depositPublicKey"
                                comment={false}
                                onChange={form.handleChange}
                                error={form.state.errors}
                                value={form.state.data}
                            />
                            <Input
                                name="withdrawPublicKey"
                                className="modal__field"
                                onChange={form.handleChange}
                                error={form.state.errors}
                                value={form.state.data}
                            />
                            <Input
                                name="withdrawAddress"
                                className="modal__field"
                                onChange={form.handleChange}
                                error={form.state.errors}
                                value={form.state.data}
                            />
                        </div>
                        <div className="quantity-wrapper mt-2">
                            <div>
                                Fee: {form.state.data.fee.amount} {form.state.data.fee.symbol}
                            </div>
                        </div>
                        {sended && <span className="clr--positive">Sidechain address has been generated.</span>}
                        {transactionError && transactionError !== "" ? 
                            <span className="clr--negative">
                                <Translate className="" content={`errors.${transactionError}`} />
                            </span> 
                            : ""}

                        <div className="modal__bottom">
                            <Close />
                            <Submit tag="create" />
                        </div>
                    </Fragment>
                        )
                    }
                }
            </Form>
        </Fragment>
    );
  }
}

export default GenerateAddress;
