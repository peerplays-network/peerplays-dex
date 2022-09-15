import React, { Component, Fragment } from "react";
import Form from "../../form/form";
import Input from "../../form/input";
import Close from "../decoration/close";
import { clearLayout } from "../../../../dispatch/index";
import { getAccountData, getStore } from "../../../../actions/store/index";
import ModalTitle from "../decoration/modalTitle";
import Submit from "../decoration/submit";
import { getGlobalData } from "../../../../actions/dataFetching/getGlobalData";
import CheckBox from "../../form/checkbox";



const checkPassword = async (data, result, keyType) => {
    const { loginData, accountData } = getStore();

    const checkPassword = loginData.checkPassword(data.password, accountData, keyType);

    if (!checkPassword) {
        result.errors.password = 'wrongPass';
        return result;
    }
    
    result.success = true;
    result.callbackData = { password: data.password, type: loginData.type };

    return result;
};

const checkWhaleVault = async (data, result) => { 
    if (window.whalevault) {         
        result.success = true;
        result.callbackData = { password: "", type: "whaleVault" };
        return result;
    } else {
        result.errors.login = 'whaleNotInstalled';
        return result;
    }
}

class PasswordCheck extends Component {
    state = {
        login: getAccountData().name,
        whaleVaultChecked: false
    };



    handleResult = (data) => {
        clearLayout();
        this.props.callback && this.props.callback(data.password, data.type);
    };

    render() {
        return (
            <Fragment>
                <ModalTitle tag="unlock" additionalData={{ keyType: this.props.keyType }} />
                <Form 
                    defaultData={{login: getAccountData().name, isWhaleVault: false}}
                    requiredFields={!this.state.whaleVaultChecked ? ['login','password'] : ['login']}
                    action={!this.state.whaleVaultChecked ? async(data, result) => checkPassword(data, result, this.props.keyType) : checkWhaleVault}
                    handleResult={this.handleResult}
                >
                    {
                        form => <Fragment>
                            <div className="modal__content">
                                <Input
                                    name="login"
                                    disabled={true}
                                    onChange={form.handleChange}
                                    error={form.state.errors}
                                    value={form.state.data}
                                    labelTag="field.labels.accName"
                                />
                                {!form.state.data.isWhaleVault ? (
                                    <Input
                                        name="password"
                                        type="password"
                                        className="modal__field"
                                        onChange={form.handleChange}
                                        error={form.state.errors}
                                        value={form.state.data}
                                        labelTag="field.labels.transactionPassword"
                                        labelParams={{ keyType: this.props.keyType }}
                                    />
                                    ) : "" }
                                {this.props.keyType && this.props.keyType !== "owner" ? (
                                    <CheckBox
                                        name="isWhaleVault"
                                        id="isWhaleVault"
                                        labelTag="field.checkboxes.whaleVault"
                                        value={form.state.data}
                                        onChange={(val, id)=>{
                                            form.handleChange(val, id)
                                            this.setState(state => ({
                                                ...state,
                                                whaleVaultChecked: val
                                            }));
                                        }}
                                    />
                                ) : "" }                     
                            </div>
                            <div className="modal__bottom">
                                <Close />
                                <Submit tag="unlock" />
                            </div>
                            
                        </Fragment>
                    }
                </Form>
            </Fragment>
        );
    }
};

export default PasswordCheck;