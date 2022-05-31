import React, { Component, Fragment } from "react";
import Form from "../../form/form";
import Input from "../../form/input";
import Close from "../decoration/close";
import { clearLayout } from "../../../../dispatch/index";
import { getAccountData, getStore } from "../../../../actions/store/index";
import ModalTitle from "../decoration/modalTitle";
import Submit from "../decoration/submit";
import { getGlobalData } from "../../../../actions/dataFetching/getGlobalData";

const checkPassword = async (data, result) => {
    const { loginData, accountData } = getStore();

    const checkPassword = loginData.checkPassword(data.password, accountData);

    if (!checkPassword) {
        result.errors.password = 'wrongPass';
        return result;
    }

    result.success = true;
    result.callbackData = { password: data.password };
    if (result.success = true) {
        setTimeout(() => {
            getGlobalData()
                .then(({ userData }) => {
                    if (userData) {
                        userData.loginData.savePassword(data.password);
                    } 
                })
        }, 2000)

    }

    return result;
};

class PasswordCheck extends Component {

    state = {
        login: getAccountData().name
    };

    handleResult = (data) => {
        clearLayout();
        this.props.callback && this.props.callback(data.password);
    };

    render() {
        return (
            <Fragment>
                <ModalTitle tag="unlock" additionalData={{ login: this.state.login }} />
                <Form requiredFields={['password']} action={checkPassword} handleResult={this.handleResult}>
                    {
                        form => <Fragment>
                            <div className="modal__content">
                                <Input
                                    name="password"
                                    type="password"
                                    onChange={form.handleChange}
                                    error={form.state.errors}
                                    value={form.state.data}
                                />
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