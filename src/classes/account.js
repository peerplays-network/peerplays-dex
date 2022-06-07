import {getStorage} from "../actions/storage";
import {store} from "../index";

class Account{
    constructor(){
        this.type = '';
        this.password = '';
        this.timeout = '';
    }
    updateReduxData(){
        ['CLEAR_LOGIN_DATA', 'UPDATE_LOGIN_DATA'].map(type => store.dispatch({type, payload: this}));
    }
    savePassword(password, type){
        const expires = Number(getStorage('settings').walletLock);
        this.type = type;

        if(this.timeout) clearTimeout(this.timeout);
        if(!expires) {
            this.updateReduxData();
            return;  
        } 

        const passwordExpiration = expires * 60000;

        this.password = password;
        this.timeout = setTimeout(this.removePassword.bind(this), passwordExpiration);

        this.updateReduxData();
    }
    removePassword(){
        this.timeout && clearTimeout(this.timeout);
        this.password = '';
        this.updateReduxData();
    }
}

export default Account;