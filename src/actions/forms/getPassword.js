import React from "react";
import PasswordCheck from "../../components/helpers/modal/content/passwordCheck";
import { setModal } from "../../dispatch/layoutDispatch";
import { getLoginData } from "../store";
import { getStorage } from "../storage";

export const getPassword = async (fn, password = getLoginData().password) => {
    if (!password) return setModal(
        <PasswordCheck callback={async password => getPassword(fn, password)} />
    );
    
    return fn(password);
};