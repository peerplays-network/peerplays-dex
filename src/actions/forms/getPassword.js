import React from "react";
import PasswordCheck from "../../components/helpers/modal/content/passwordCheck";
import { setModal } from "../../dispatch/layoutDispatch";
import { getLoginData } from "../store";
import { getStorage } from "../storage";

// keyType can be active, memo, and owner
export const getPassword = async (fn, keyType, password = '') => {
    
    if(password) {
        return fn(password, keyType)
    } else {
        if(getLoginData.type === 'password' && getLoginData.password) {
            return fn(getLoginData.password, 'password')
        } else if(getLoginData.type === keyType && getLoginData.password) {
            return fn(getLoginData.password, keyType)
        } else if(keyType === 'whaleVault') {
            return fn('', keyType)
        }
    }

    return setModal(
        <PasswordCheck keyType={keyType} callback={async (password, type) => getPassword(fn, type, password)} />
    );
    
};