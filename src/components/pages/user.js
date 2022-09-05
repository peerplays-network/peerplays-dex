import React, {Component} from 'react';
import {NavLink, Route, Switch} from "react-router-dom";
import Tbd from "./tbd";
import QuantityConverter from "../helpers/quantityConverter";
import UserAssets from "./userAssets";
import OpenOrders from "./openOrders";
import UserActivity from "./userActivity";
import UserPermissions from "./userPermissions";
import {getStorage} from "../../actions/storage";
import counterpart from 'counterpart';

const userMenu = [
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
        tag: 'positions'
    },
    {
        link: '/blacklist',
        tag: 'blacklist'
    },
    {
        link: '/permissions',
        tag: 'permissions',
        component: UserPermissions
    }
];

class User extends Component{

    state = {
        userChecked: false
    };

    componentDidMount(){
        const userName = getStorage('account').name;

        if(userName !== this.props.match.params.id){
            this.props.history.goBack();
            return;
        }

        this.setState({userChecked: true});
    }

    render(){
        if(!this.state.userChecked) return 'Loading';

        return(
            <div className="container page">
                <div className="page__user-title">
                    <h1 className="page__title">{this.props.match.params.id}</h1>
                    <QuantityConverter />
                </div>
                <div className="page__menu">
                    {userMenu.map((el, id) => (
                        <NavLink  
                            key={id} 
                            to={`/user/${this.props.match.params.id}${el.link}`}
                            className="page__menu-item"
                            exact
                        >
                            {counterpart.translate(`${el.tag}.title`)}
                        </NavLink>
 
                    ))}
                </div>
                <div className="page__content">
                    <Switch>
                        {
                            userMenu.map((el, id) => (
                                <Route
                                    key={id}
                                    path={`/user/${this.props.match.params.id}${el.link}`}
                                    component={el.component ? el.component : Tbd}
                                    exact
                                />
                            ))
                        }
                    </Switch>
                </div>
            </div>
        )
    }
}

export default User;