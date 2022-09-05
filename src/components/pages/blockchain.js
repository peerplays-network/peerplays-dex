import React from 'react';
import {NavLink, Route, Switch} from "react-router-dom";
import Tbd from "./tbd";
import Witnesses from "./blockchain/witnesses";
import Committee from "./blockchain/committee";
import Fees from "./blockchain/fees";
import Explorer from "./blockchain/explorer";
import Assets from "./blockchain/assets";
import counterpart from 'counterpart';

const blockchainMenu = [
    {
        link: '/',
        tag: 'blockchain',
        component: Explorer
    },
    {
        link: '/assets',
        tag: 'assets',
        component: Assets
    },
    {
        link: '/witnesses',
        tag: 'witnesses',
        component: Witnesses
    },
    {
        link: '/committee',
        tag: 'committee',
        component: Committee
    },
    {
        link: '/fees',
        tag: 'fees',
        component: Fees
    }
];

const Blockchain = () => (
    <div className="container page">
        <div className="page__header-wrapper">
            <h1 className="page__title">{counterpart.translate(`blockchain.title`)}</h1>
        </div>
        <div className="page__menu">
            {
                blockchainMenu.map((el, id) => (
                    <NavLink 
                        key={id} 
                        to={`/blockchain${el.link}`}
                        className="page__menu-item"
                        exact
                    >
                        {counterpart.translate(`blockchain.${el.tag}.title`)}
                    </NavLink>

                ))
            }
        </div>
        <div className="page__content">
            <Switch>
                {
                    blockchainMenu.map((el, id) => (
                        <Route
                            key={id}
                            path={`/blockchain${el.link}`}
                            component={el.component ? el.component : Tbd}
                            exact
                        />
                    ))
                }
            </Switch>
        </div>
    </div>
);

export default Blockchain;