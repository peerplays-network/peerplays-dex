import React from 'react';
import GeneralSettings from "./generalSettings";
import Security from "./security";
import PageMenu from "../../helpers/pageMenu";
import Membership from "./membership";
import {connect} from "react-redux";
import counterpart from 'counterpart';

const settingsMenu = [
    {
        link: '/',
        tag: 'general',
        component: GeneralSettings
    },
    {
        link: '/security',
        tag: 'security',
        component: Security
    },
    {
        link: '/membership',
        tag: 'membership',
        component: Membership
    }
];

const Settings = ({account}) => (
    <div className="container page">
        <div className="page__header-wrapper">
            <h1 className="page__title">{counterpart.translate(`settings.title`)}</h1>
        </div>
        <PageMenu items={account ? settingsMenu : settingsMenu.slice(0, settingsMenu.length - 1)} link={'/settings'} path={'/settings'} />
    </div>
);

const mapStateToProps = state => ({account: state.accountData});

export default connect(mapStateToProps)(Settings);