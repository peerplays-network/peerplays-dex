import React, {useState} from "react";
import { connect } from "react-redux";
import { Sidechains } from "../../params/networkParams";
import ActionsBtn from "./buttons/actionsBtn";
import Link from "react-router-dom/es/Link";
import { store } from "../../index";
import { removeStorageItem } from "../../actions/storage";
import { dispatchSendModal } from "../../actions/forms/dispatchSendModal";
import UnlockProfile from "./unlockProfile";
import Button from "./buttons/button";
import RoundButton from "./buttons/roundButton";
import { dispatchGenerateAddress } from '../../actions/forms/dispatchGenerateAddress';
import {IconCopy} from "../../svg";
import counterpart from "counterpart";


const UserData = (props) => {
    const { data, sidechainAccounts, history } = props;
    const [copyed, setCopyed] = useState(false);
    const sidechainAddresses = {};
    Sidechains.map((el) => {
        if (sidechainAccounts) {
            var acc = sidechainAccounts.find(({ sidechain }) => sidechain == el.toLowerCase());
            if (acc) {
                sidechainAddresses[el] = acc.deposit_address;
            }
        }
    });

    const logout = () => {
        ['account', 'notifications'].forEach(type => {
            removeStorageItem(type);
            removeStorageItem(type, 'sessionStorage');
            store.dispatch({ type: `REMOVE_${type.toUpperCase()}` })
        });
        removeStorageItem('referrer');
        removeStorageItem('referrer', 'sessionStorage');
        store.dispatch({ type: 'SET_SIDECHAIN_ACCOUNTS', payload: false })
        history.push('/');
    };
    const closeDropdown = (e) => {
        let node = e.target;

        while (!node.classList.contains('open')) {
            if (node.tagName === 'BODY') break;
            node = node.parentNode;
        }

        node.classList.remove('open');
    };
    const sendUserTokens = e => {
        closeDropdown(e);
        dispatchSendModal();
    };

    const generateAddress = (e, sidechain) => {
        closeDropdown(e);
        dispatchGenerateAddress(sidechain);
    }

    const copyToClip = (txt) => {
        navigator.clipboard.writeText(txt);
        setCopyed(true);
        setTimeout(() => {
            setCopyed(false);
        }, 5000);
    }

    return (
        <div className="drop-user">
            <div className="drop-user__title">
                <Link to="/assets/" className="drop-user__name" onClick={closeDropdown}>{data.name}</Link>
                <div className="drop-user__user-actions">
                    <UnlockProfile closeDropdown={closeDropdown} />
                    <ActionsBtn
                        actionsList={[
                            <Button tag="logout" onClick={logout} />
                        ]}
                    />
                </div>
            </div>
            <div className="drop-user__assets">
                {data.assets.map((el, id) => (
                    <div key={id} className="drop-user__asset">
                        <span>{el.symbol}</span>
                        <span>{el.amount / (10 ** el.precision) }</span>
                    </div>
                ))}
            </div>
            <div className="drop-user__sidechain-address">
                <h3 className="drop-user__wallets-title">
                    {counterpart.translate(`layout.sidechainAccounts`)}
                </h3>
               {Sidechains.map((el) => (
                    sidechainAddresses[el] != undefined ? <div className="drop-user__sidechain-address-item" key={el}><span>{el}&nbsp;: </span><input className="input" defaultValue={sidechainAddresses[el]} disabled/><button onClick={() => copyToClip(sidechainAddresses[el])}> <span style={{color:"green", fontSize:'10px'}}>{copyed?sidechainAddresses[el] == ''?'Blank value':'Copied':''}</span> <IconCopy/></button></div> : ''
                ))}
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    data: state.accountData,
    sidechainAccounts: state.accountData.sidechainAccounts
});

export default connect(mapStateToProps)(UserData);

