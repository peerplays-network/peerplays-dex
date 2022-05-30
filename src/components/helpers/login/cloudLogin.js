import React, {Fragment} from 'react';
import {authByLogin} from "../../../actions/forms";
import Form from "../form/form";
import Input from "../form/input";
import CheckBox from "../form/checkbox";
import Close from "../modal/decoration/close";
import Submit from "../modal/decoration/submit";

const CloudLogin = ({handleLogin}) => (
    <Form
        requiredFields={['login']}
        defaultData={{remember: true, whaleVault: true}}
        action={authByLogin}
        handleResult={handleLogin}
    >
        {
            form => <Fragment>
                <div className="modal__content">
                    <Input
                        name="login"
                        onChange={form.handleChange}
                        error={form.state.errors}
                        value={form.state.data}
                    />
                    {!form.state.data.whaleVault ? (
                        <Input
                            name="password"
                            type="password"
                            labelTag="field.labels.loginPassword"
                            className='modal__field'
                            onChange={form.handleChange}
                            error={form.state.errors}
                            value={form.state.data}
                        />
                    ) : ""}
                   
                    <CheckBox
                        name="whaleVault"
                        id="whaleVault"
                        labelTag="field.checkboxes.whaleVault"
                        value={form.state.data}
                        onChange={form.handleChange}
                    />
                    <CheckBox
                        name="remember"
                        id="remember"
                        labelTag="field.checkboxes.remember"
                        value={form.state.data}
                        onChange={form.handleChange}
                    />
                </div>
                <div className="modal__bottom">
                    <Close />
                    <Submit tag="login"/>
                </div>
            </Fragment>
        }
    </Form>
);

export default CloudLogin;
