import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import Dashboard from "../pages/dashboard";
import Tbd from "../pages/tbd";
import User from "../pages/user/";
import Blockchain from "../pages/blockchain";
import Business from "../pages/business";
import Settings from "../pages/settings/";
import MyContacts from "../pages/myContacts";
import Exchange from "../pages/exchange";
import Voting from "../pages/voting";
import MyAssets from "../pages/myAssets";
import Block from "../helpers/block";
import AssetPage from "../pages/asset/assetPage";
import PrivateRoute from './PrivateRoute';
import BitcoinTransactions from '../pages/bitcoin';
import HiveTransactions from '../pages/hive';

class Main extends Component {
    render() {
 return (
            <main>
                <Switch>
                    <Route exact path="/" component={Dashboard} />
                    <PrivateRoute exact path="/exchange/:pair" component={Exchange} />
                    <PrivateRoute path="/assets" component={MyAssets} />
                    <PrivateRoute path="/blockchain" component={Blockchain} />
                    <PrivateRoute path="/voting-vesting" component={Voting} />
                    <PrivateRoute path="/business" component={Business} />
                    <PrivateRoute path="/settings/" component={Settings} />
                    <PrivateRoute path="/user/:name" component={User} />
                    <PrivateRoute exact path="/contacts" component={MyContacts} />
                    <PrivateRoute exact path="/help" component={Tbd} />
                    <PrivateRoute exact path="/block/:number" component={Block} />
                    <PrivateRoute path="/asset/:symbol" component={AssetPage} />
                    <PrivateRoute path="/bitcoin" component={BitcoinTransactions} />
                    <PrivateRoute path="/hive-hbd" component={HiveTransactions} />
                </Switch>
            </main>
        )
    }
}

export default Main;
