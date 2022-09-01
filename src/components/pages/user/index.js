import React, {Component} from 'react';
import QuantityConverter from "../../helpers/quantityConverter";
import UserAssets from "./userAssets";
import OpenOrders from "./openOrders";
import UserActivity from "./userActivity";
import UserPermissions from "./userPermissions";
import UserMargins from "./userMargins";
import PageMenu from "../../helpers/pageMenu";
import UserVoting from "./userVoting";
import dataFetch from "../../helpers/dataFetch";
import Avatar from "../../helpers/avatar";
import {checkActivity, formAccount, getFullAccount} from "../../../actions/account";
import {connect} from "react-redux";
import {clearUserPage, setUserPage} from "../../../dispatch/userPage";

const basicMenu = [
    {
        link: '/',
        tag: 'userAssets',
        component: UserAssets
    },
    {
        link: '/orders',
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
    {
        link: '/voting-vesting',
        tag: 'voting',
        component: UserVoting
    },
    {
        link: '/permissions',
        tag: 'permissions',
        component: UserPermissions
    },
    {
        link: '/blacklist',
        tag: 'blacklist'
    }
];

const checkUser = async (context) => {
    const {match, history} = context.props;
    if(checkActivity(match.params.name)) {
        history.replace('/');
        history.push('/assets/');
        return {};
    }

    const account = await getFullAccount(match.params.name, true);

    if(!account) return [];

    const data = await formAccount(account);

    setUserPage(data);

    return {data: true};
};

class User extends Component{
    componentWillReceiveProps(nextProps){
        if(this.props.match.params.name !== nextProps.match.params.name){
            this.props.reset();
        }
    }

    componentWillUnmount(){
        clearUserPage();
    }

    render(){

        const menu = basicMenu;

        const userData = this.props.account;
        const {name, assets} = userData;

        return(
            <div className="container page">
                <div className="page__user-title">
                    <Avatar userName={name}/>
                    <h1 className="page__title">{name}</h1>
                    {/* <QuantityConverter assets={assets} /> */}
                </div>
                <PageMenu items={menu} link={`/user/${name}`} path={'/user/:name'} data={userData} />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({account: state.pageData});
const component = connect(mapStateToProps)(User);

export default dataFetch({method: checkUser, disableNextProps: true})(component);