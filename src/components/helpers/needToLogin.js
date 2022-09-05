import React from "react";
import CreateUser from "./modal/content/createUser";
import IconLogin from "../../svg/login.svg";
import {setModal} from "../../dispatch/layoutDispatch";
import Button from "./buttons/button";
import counterpart from "counterpart";

const NeedToLogin = ({pageName, image = <IconLogin />}) => (
    <div className="login-needed">
        {image && <div className="login-needed__image">{image}</div>}
        <span className="login-needed__text" pageName={<span>{counterpart.translate(`${pageName}.title`)}</span>}>
            {counterpart.translate(`emptyPage.login`)}
        </span>
        <Button tag="createAccount" className="btn--round" onClick={() => setModal(<CreateUser />)} />
    </div>
);

export default NeedToLogin;