import React, {Component} from "react";
import IconLocked from "../../svg/locked.svg";
import IconUnlocked from "../../svg/unlocked.svg";
import {connect} from "react-redux";
import PasswordCheck from "./modal/content/passwordCheck";
import {setModal} from "../../dispatch/layoutDispatch";
import { getStorage } from "../../actions/storage";

class UnlockProfile extends Component{

    state = {
        lock: false
    };

    lockProfile = (e) => {
        e.preventDefault();
        this.setState({lock:false})
        setTimeout(() => this.props.loginData.removePassword(), 0);
    };

    unlockProfile = (e) => {
        this.props.closeDropdown(e);
        const callback = (e)=>{
            if(e && this.props.walletLock !== 0){ this.setState({lock:true}) }
        }
        setModal(<PasswordCheck callback={callback}/>)
    };

    render() { 
        return this.state.lock
            ? <button onClick={this.lockProfile}><IconUnlocked /></button>
            : <button onClick={this.unlockProfile}><IconLocked /></button>
    }
}

const mapStateToProps = state => ({ loginData: state.loginData, walletLock: getStorage('settings').walletLock });

export default connect(mapStateToProps)(UnlockProfile);