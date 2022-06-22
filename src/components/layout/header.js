import React, {Fragment} from 'react';
import {connect} from "react-redux";
import Dropdown from "../helpers/form/dropdown";
import UserData from "../helpers/userData";
import {IconSearch} from "../../svg";
import Notifications from "../helpers/notify/notifications";
import Avatar from "../helpers/avatar";
import LogIn from "../helpers/modal/content/logIn";
import {openMenu, openSearch, setModal} from "../../dispatch/layoutDispatch";
import Button from "../helpers/buttons/button";

const Header = ({account, history, sidechainAccounts}) => (
    <header>
        { account ?  
        <button className="header__burger" onClick={openMenu}>
            <span></span>
            <span></span>
            <span></span>
        </button> : <div></div> }
        <div className="header__user-data">
            <button onClick={openSearch}><IconSearch /></button>
            {!account
                ? <Button tag="login" onClick={() => setModal(<LogIn/>)} />
                : <Fragment>
                    <Notifications />
                    <Dropdown
                        btn={
                            <div className="header__user">
                                <span className="header__user-name">{account.name}</span>
                                <Avatar userName={account.name} />
                            </div>
                        }
                        body={ <UserData history={history}/> }
                        position="top-right"
                    />
                </Fragment>
            }
        </div>
    </header>
);

const mapStateToProps = (state) => ({
  account: state.accountData,
});

export default connect(mapStateToProps)(Header);
