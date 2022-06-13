import React, {Component, Fragment} from "react";
import Close from "../decoration/close";
import ModalTitle from "../decoration/modalTitle";
import ModalButton from "../../buttons/modalButton";
import Translate from "react-translate-component";
import {clearLayout} from "../../../../dispatch/layoutDispatch";
import {defaultTrx} from "../../../../actions/forms";

class WarningModal extends Component{

    state = {
        errors: this.props.error
    };

    handleMethod = () => {
        const {trx, password, keyType} = this.props;
        defaultTrx({trx, password, keyType})
            .then(result => { if(result.success){
                clearLayout();   
            }
        })
            .catch(err => {
                if(err.message.includes('Insufficient Balance')) this.setState({errors: 'isNotEnough'})
            });
    };

    render(){

        const fee = this.props.fee;
        const errors = this.state.errors;

        return(
            <Fragment>
                <ModalTitle tag="warning" />
                <Translate
                    component="div"
                    content={!errors ? `modal.warning.message` : `errors.${errors}`}
                    className={!errors ? '' : 'modal__error'}
                    with={{fee}}
                />
                <div className="modal__bottom">
                    <Close />
                    {!errors && <ModalButton tag="continue" onClick={this.handleMethod} /> }
                </div>
            </Fragment>
        )
    }
};

export default WarningModal;