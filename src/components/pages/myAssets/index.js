import React, {Component} from 'react';
import PageMenu from "../../helpers/pageMenu";
import {connect} from "react-redux";
import UserAssets from "../user/userAssets";
import OpenOrders from "../user/openOrders";
import UserActivity from "../user/userActivity";
import UserMargins from "../user/userMargins";
import NeedToLogin from "../../helpers/needToLogin";
import {formAccount} from "../../../actions/account/formAccount";
import counterpart from 'counterpart';

const basicMenu = [
    {
        link: '/',
        tag: 'userAssets',
        component: UserAssets
    },
    {
        link: '/orders/',
        tag: 'orders',
        component: OpenOrders
    },
    {
        link: '/activity',
        tag: 'activity',
        component: UserActivity
    },
    {
        link: '/positions',
        tag: 'positions',
        component: UserMargins
    },
    // {
    //     link: '/permissions',
    //     tag: 'permissions',
    //     component: AssetsPermissions
    // }
];

class MyAssets extends Component{

    state = {
        accountData : ''
     };

    render(){

        const userData = this.props.account;

        const {id} = userData;
        formAccount(id).then((res) => {this.setState({accountData : res})})

        if(!userData) return <NeedToLogin pageName={'assets'} />;

        return(
            <div className="container page">
                <div className="page__user-title">
                    <h1 className="page__title">{counterpart.translate(`assets.title`)}</h1>
                </div>
                <PageMenu items={basicMenu} link={`/assets`} path={'/assets'} data={this.state.accountData} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({account: state.accountData});

export default connect(mapStateToProps)(MyAssets);