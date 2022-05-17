import React from 'react';
import {NavLink, Route, Switch} from "react-router-dom";
import Tbd from "./tbd";
import Translate from "react-translate-component";
import Witnesses from "./blockchain/witnesses";
import Committee from "./blockchain/committee";
import Fees from "./blockchain/fees";
import Explorer from "./blockchain/explorer";
import Assets from "./blockchain/assets";

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
    // {
    //     link: '/markets',
    //     tag: 'markets',
    // },
    {
        link: '/fees',
        tag: 'fees',
        component: Fees
    }
];

const Blockchain = () => (
    <div className="container page">
        <div className="page__header-wrapper">
            <Translate className="page__title" component="h1" content={"blockchain.title"}/>
        </div>
        <div className="page__menu">
            {
                blockchainMenu.map((el, id) => (
                    <Translate
                        key={id}
                        content={`blockchain.${el.tag}.title`}
                        component={NavLink}
                        to={`/blockchain${el.link}`}
                        className="page__menu-item"
                        exact
                    />
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