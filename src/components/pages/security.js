import counterpart from "counterpart";
import React, {Component} from "react";
import {editStorage, getStorage} from "../../actions/storage";
import Dropdown from "../helpers/dropdown";
import SelectHeader from "../helpers/selectHeader";

class Security extends Component{
    state = {
        walletLock: getStorage('settings').walletLock
    };

    changeLock = (e) => {
        const result = {walletLock: e.target.innerText};
        editStorage('settings', result);
        this.setState(result);
    };

    render(){
        return(
            <div className="security">
                <div className="security__item">
                    <h2>{counterpart.translate(`security.lock`)}</h2>
                    <Dropdown
                        btn={<SelectHeader
                            labelTag="security.lockLabel"
                            text={this.state.walletLock}
                            className="with-bg with-border"
                        />}
                        list={[
                            0, 1, 2, 3, 4, 5
                        ].map((e, id) => <button key={id} onClick={this.changeLock}>{e}</button>)}
                    />
                </div>
                <div className="security__item">
                    <h2>{counterpart.translate(`security.password`)}</h2>
                    <span className="security__tbd">{counterpart.translate(`global.tbd`)}</span>
                </div>
            </div>
        )
    }
};

export default Security;