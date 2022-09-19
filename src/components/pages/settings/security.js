import React, {Component} from "react";
import {editStorage, getStorage} from "../../../actions/storage/index";
import Dropdown from "../../helpers/form/dropdown";
import SelectHeader from "../../helpers/selectHeader";
import {deleteCookie, getCookie, setCookie} from "../../../actions/cookie";
import { getStore } from "../../../actions/store";
import counterpart from "counterpart";

class Security extends Component{
    state = {
        walletLock: getStorage('settings').walletLock
    };

    changeLock = (e) => {

        const {loginData} = getStore();
        const walletLock = Number(e.target.innerText);
        const result = {walletLock};

        editStorage('settings', result);

        if(loginData.password && walletLock === 0){
            loginData.removePassword();
        } else if(loginData.password){
            loginData.savePassword(loginData.password, loginData.type)
        }

        this.setState(result);
    };

    render(){

        const walletLock = this.state.walletLock;
        const list = ['0', '30', '60', '90', '180', '210'];

        return(
            <div className="security">
                <div className="security__item">
                    <h2>{counterpart.translate(`security.lock`)}</h2>
                    <Dropdown
                        btn={<SelectHeader labelTag="security.lockLabel" text={walletLock} />}
                        list={list.map((e, id) => <button key={id} onClick={this.changeLock}>{e}</button>)}
                    />
                </div>
               
            </div>
        )
    }
};

export default Security;