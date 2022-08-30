import React, {Fragment} from 'react';
import Tbd from "../pages/tbd";
import {NavLink, Route, Switch} from "react-router-dom";
import counterpart from 'counterpart';

const PageMenu = ({items, link, path, data = {}}) => (
    <Fragment>
        <div className="page__menu">
            {items.map((el, id) => (
                <NavLink 
                    key={id} 
                    to={`${link}${el.link}`}
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
                    items.map((el, id) => {
                        const Component = el.component ? el.component : Tbd;
                        return (
                            <Route
                                key={id}
                                path={`${path}${el.link}`}
                                render={(props) => <Component data={data} {...props} />}
                                exact
                            />
                        )
                    })
                }
            </Switch>
        </div>
    </Fragment>
);

export default PageMenu;