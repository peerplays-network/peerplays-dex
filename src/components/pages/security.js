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
                    <Translate content="security.lock" component="h2" />
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
                    <Translate content="security.password" component="h2" />
                    <Translate content="global.tbd" className="security__tbd" />
                </div>
            </div>
        )
    }
};

export default Security;