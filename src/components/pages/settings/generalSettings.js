import React, {Component} from 'react';
import {defaultLocales} from "../../../params/defaultLocales";
import {setLocale} from "../../../actions/locale/setLocale";
import Switcher from "../../helpers/switcher";
import {editStorage, getStorage} from "../../../actions/storage/index";
import CheckBox from "../../helpers/form/checkbox";
import Dropdown from "../../helpers/form/dropdown";
import SelectHeader from "../../helpers/selectHeader";
import Input from "../../helpers/form/input";
import {faucetUrl} from "../../../params/networkParams";
import Faucet from "./faucet";
import counterpart from 'counterpart';

class GeneralSettings extends Component {

    state = {
        formData: {
            faucet: faucetUrl,
            notifications: true
        },
        activeLang: '',
        darkTheme: true,
        advancedMode: false
    };

    componentDidMount(){
        const {language, darkTheme, advancedMode, notifications} = getStorage('settings');

        const formData = {
            faucet: faucetUrl,
            notifications
        };

        this.setState({
            activeLang: defaultLocales.find(e => e.type === language).title,
            darkTheme,
            advancedMode,
            formData
        });
    }

    changeLocale = ({title, type}) => {
        setLocale(type);
        editStorage('settings', {language: type});
        this.setState({activeLang: title});
    };

    handleNotifications = (val) => {

        const formData = {...this.state.formData};

        const id = 'notifications';

        formData[id] = val;

        editStorage('settings', {[id]: val});
        this.setState({formData});
    };

    themeChange = (e) => {
        const id = 'darkTheme';
        const val = e;
        const changes = {[id]: val};
        editStorage('settings', changes);
        this.setState(changes);
    };

    modeChange = (e) => {
      const id = 'advancedMode';
      const val = e;
      const changes = {[id]: val};
      editStorage('settings', changes);
      this.setState(changes);
  };

    render(){

        const {formData, activeLang, advancedMode, darkTheme} = this.state;

        const localesList = defaultLocales.map((el, id) => <button key={id} onClick={() => this.changeLocale(el)}>{el.title}</button>);

        return (
            <div className="settings">
                <h2>{counterpart.translate(`general.interface`)}</h2>
                <Dropdown
                    btn={<SelectHeader labelTag="general.language" text={activeLang} />}
                    list={localesList}
                />
                {/* <Switcher
                    id="themeSwitch"
                    label="general.theme"
                    selected={darkTheme}
                    handleChange={this.themeChange}
                /> */}
                <Switcher
                    id="modeSwitch"
                    label="general.mode"
                    selected={advancedMode}
                    handleChange={this.modeChange}
                />
                <h2>{counterpart.translate(`general.notifications`)}</h2>
                <CheckBox
                    id="notifications"
                    labelTag="general.transferNotifications"
                    value={formData}
                    onChange={this.handleNotifications}
                />
                <h2>{counterpart.translate(`general.faucet`)}</h2>
    
                <Faucet value={formData.faucet}/>
            </div>
        );
    }
}

export default GeneralSettings;