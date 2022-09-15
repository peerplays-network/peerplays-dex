import React, {Component} from "react";
import {IconLocked, IconUnlocked} from "../../svg";
import {connect} from "react-redux";
import PasswordCheck from "./modal/content/passwordCheck";
import {setModal} from "../../dispatch/layoutDispatch";

class UnlockProfile extends Component{

    state = {
        lock:false,
    };

    lockProfile = (e) => {
        e.preventDefault();
        this.setState({lock:false})
        setTimeout(() => this.props.loginData.removePassword(), 0);
    };

    

    unlockProfile = (e) => {
        this.props.closeDropdown(e);
        const callback = (e)=>{
            if(e){ this.setState({lock:!this.lock}) }
        }
        setModal(<PasswordCheck callback={callback}/>)
    };

    render(){ 
        return this.state.lock
            ? <button onClick={this.lockProfile}><IconUnlocked /></button>
            : <button onClick={this.unlockProfile}><IconLocked /></button>
    }
}

const mapStateToProps = state => ({loginData: state.loginData});

export default connect(mapStateToProps)(UnlockProfile);