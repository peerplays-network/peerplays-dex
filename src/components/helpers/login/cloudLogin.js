import React, {Fragment, useState} from 'react';
import {authByLogin} from "../../../actions/forms";
import Form from "../form/form";
import Input from "../form/input";
import CheckBox from "../form/checkbox";
import Close from "../modal/decoration/close";
import Submit from "../modal/decoration/submit";
import { editStorage, getStorage } from '../../../actions/storage';
import Dropdown from "../dropdown";
import SelectHeader from '../selectHeader';

const CloudLogin = ({handleLogin}) =>  {
    const requiredFields = ['login', 'password'];
    const [whaleVaultChecked, setWhaleVaultChecked] = useState(false);
    const [walletLock, setWalletLock] = useState(0)
    const changeLock = (e) => {
        const result = {walletLock: e.target.innerText};
        editStorage('settings', result);
        setWalletLock(Number(e.target.innerText))
    };
    return(
        <Form
            requiredFields={!whaleVaultChecked ? requiredFields : requiredFields.slice(0, 1)}
            defaultData={{remember: false, isWhaleVault: false}}
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
                        {!form.state.data.isWhaleVault ? (
                            <Fragment>
                                <Input
                                    name="password"
                                    type="password"
                                    labelTag="field.labels.loginPassword"
                                    className='modal__field'
                                    onChange={form.handleChange}
                                    error={form.state.errors}
                                    value={form.state.data}
                                />
                                <Dropdown
                                    name="walletLockTime"
                                    id="walletLockTime"
                                    onChange={form.handleChange}
                                    btn={<SelectHeader
                                        labelTag="security.lockLabel"
                                        text={walletLock}
                                        className="with-bg with-border modal__field"
                                    />}
                                    list={[
                                        0, 30, 60,
                                    ].map((e, id) => <button type="button" key={id} onClick={changeLock}>{e}</button>)}
                                />
                             </Fragment>
                        ) : ""}
                        <CheckBox
                            name="isWhaleVault"
                            id="isWhaleVault"
                            labelTag="field.checkboxes.whaleVault"
                            value={form.state.data}
                            onChange={(val, id)=>{
                                form.handleChange(val, id)
                                setWhaleVaultChecked(val)
                            }}
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
    )
};

export default CloudLogin;
