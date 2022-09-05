import React, {Component, Fragment} from "react";
import Close from "../decoration/close";
import ModalTitle from "../decoration/modalTitle";
import ModalButton from "../../buttons/modalButton";
import {clearLayout} from "../../../../dispatch/layoutDispatch";
import {defaultTrx} from "../../../../actions/forms";
import counterpart from "counterpart";
import { updateAccountAndLoginData } from '../../../../actions/account';

class WarningModal extends Component{

    state = {
        errors: this.props.error,
        disabled: false
    };

    handleMethod = () => {
        const { trx, password, keyType } = this.props;
        this.setState({ disabled: true });
        defaultTrx({trx, password, keyType})
            .then(result => { 
                if(result.success) {
                    clearLayout(); 
                    updateAccountAndLoginData();
                } else {
                    if(result.transactionError && result.transactionError !== "") {
                        this.setState({ errors: result.transactionError, disabled: false })
                    }

                }
            })
            .catch(err => {
                
                if(err.message.includes('Insufficient Balance')) {
                    this.setState({ errors: 'isNotEnough', disabled: false })
                } else {
                    this.setState({ errors: err.message.split(":")[0].replace(/\s+/g, "_"), disabled: false })
                }
            });
    };

    render(){

        const fee = this.props.fee;
        const errors = this.state.errors;
        const disabled = this.state.disabled;

        return(
            <Fragment>
                <ModalTitle tag="warning" />
                <div className={!errors ? '' : 'modal__error'}>
                    {counterpart.translate(`${!errors ? `modal.warning.message` : `errors.${errors}`}`, {fee})}
                </div>
                <div className="modal__bottom">
                        <Close />
                        {!errors && <ModalButton tag="continue" onClick={this.handleMethod} disabled={disabled} />}
                </div>
            </Fragment>
        )
    }
};

export default WarningModal;