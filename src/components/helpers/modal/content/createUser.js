import React, { Fragment, useEffect, useState } from "react";
import Form from "../../form/form";
import Input from "../../form/input";
import InfoBlock from "../../infoBlock";
import Close from "../decoration/close";
import RadioGroup from "../../form/radioGroup";
import { createUser } from "../../../../actions/forms/createUser/index";
import { setNewAccount } from "../../../../actions/account/index";
import Submit from "../decoration/submit";
import ModalTitle from "../decoration/modalTitle";
import { getStorage } from "../../../../actions/storage";
import { checkReferrer } from "../../../../actions/forms/errorsHandling/checkReferrer";
import { generatePassword } from "../../password";
import { IconCopy } from '../../../../svg';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";



const CreateUser = () => {
    const referrer = getStorage('referrer', 'sessionStorage').name;
    const [referrerError, setReferrerError] = useState("");
    const [randomPassword, setRandomPassword] = useState(()=> generatePassword());
    const [copied, setCopied] = useState(false);

    const copyPassword = () => {
        navigator.clipboard.writeText(randomPassword);
        setCopied(true)
    }



    useEffect(() => {     
        checkReferrer({ referrer }).then(result => {
            setReferrerError(result);
        })
    }, [])
    return (
        <Fragment>
            <ModalTitle tag="createUser" />
            <Form
                requiredFields={['newLogin', 'password', 'passwordCheck']}
                defaultData={referrer ? {referrer, password: randomPassword} : {password: randomPassword}}
                action={createUser}
                handleResult={setNewAccount}
            >
                {
                    form => <Fragment>
                        <div className="modal__content">
                            <Input
                                name="newLogin"
                                comment={false}
                                onChange={form.handleChange}
                                error={form.state.errors}
                                value={form.state.data}
                            />
                            <InfoBlock tag="modal.createUser.aboutLogin" />
                            <div className="copy-container">
                                <Input
                                    name="password"
                                    onChange={form.handleChange}
                                    error={form.state.errors}
                                    value={form.state.data}
                                    disabled={true}
                                />
                                <div style={{display: "flex", flexDirection: "column", marginLeft: '5px', alignItems: 'center', justifyContent: 'center'}}>
                                    {copied && (<span style={{color: "green", fontSize: '12px', marginBottom: '5px'}}>Copied</span>)}
                                    <IconCopy style={{cursor:"pointer"}} onClick={()=>{copyPassword()}}/>
                                </div>
                            </div>
                            <Input
                                name="passwordCheck"
                                type="password"
                                className="modal__field"
                                onChange={form.handleChange}
                                error={form.state.errors}
                                value={form.state.data}
                            />

                            {referrer && (!referrerError ? (
                                <InfoBlock tag="modal.createUser.referrer" data={{ referrer }} />
                            ) : (
                                <InfoBlock tag={referrerError} data={{ referrer }} className="info-block__warning" />
                            )
                            )}
                        </div>
                        <div className="modal__bottom">
                            <Close />
                            <Submit tag="create" />
                        </div>
                    </Fragment>
                }
            </Form>
        </Fragment>
    );
}

export default CreateUser;