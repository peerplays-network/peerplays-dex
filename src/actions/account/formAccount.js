import React from "react";
import Translate from "react-translate-component";
import {getFullAccount} from "./getFullAccount";
import {formAssetData} from "../assets";
import {getUserHistory} from "../dataFetching";
import {defaultToken} from "../../params/networkParams";
import {dbApi} from "../nodes";
import {IconCreate, IconSend} from "../../svg";
import {getPassword} from "../forms";
import IssueAsset from "../../components/helpers/modal/content/issueAsset";
import {setModal} from "../../dispatch";
import {editStorage, getStorage} from "../storage";
import Link from "react-router-dom/es/Link";
import {getSidechainAccounts} from "./getSidechainAccounts";

const formMembershipData = async fullAcc => {
    const {account, lifetime_referrer_name, referrer_name, registrar_name, statistics} = fullAcc;

    const isLifetimeMember = lifetime_referrer_name === account.name;

    const asset = await formAssetData({symbol: defaultToken, amount: statistics.lifetime_fees_paid});
    const feesPaid = asset.toString();

    const networkFee = account.network_fee_percentage / 100;
    const lifetimeFee = account.lifetime_referrer_fee_percentage / 100;
    const referrerFee = (100 - networkFee - lifetimeFee) * account.referrer_rewards_percentage / 10000;
    const registrarFee = (100 - referrerFee - networkFee - lifetimeFee);

    let date = account.membership_expiration_date;

    if(date === "1970-01-01T00:00:00"){
        date = 'N/A'
    } else if(date === "1969-12-31T23:59:59"){
        date = 'Never'
    }

    const allocation = {
        network: {
            percent: networkFee
        },
        reviewer: {
            user: lifetime_referrer_name,
            percent: lifetimeFee
        },
        registrar: {
            user: registrar_name,
            percent: registrarFee
        },
        referrer: {
            user: referrer_name,
            percent: referrerFee
        },
        expiration: { date }
    };

    return {isLifetimeMember, feesPaid, allocation}
};

const contactsInfo = async (account, listed, type) => {
    const contacts = [];
    if (account[listed].length) {
        account[listed].map(async id => {
            contacts.push({
                id,
                type,
                name: await getUserName(id)
            })
        });
    }

    return contacts;
};

export const formAccount = async (data) => {
    let fullAcc = data;

    if (typeof(data) === 'string') {
        fullAcc = await getFullAccount(data, true);
    }

    if(fullAcc === false) {
      return;
    }

    const {account, balances, limit_orders, call_orders, votes} = fullAcc;
    const {id, name, active, owner, options} = account;
    let sidechainAccounts = await getSidechainAccounts(id);
    const assets = await Promise.all(balances.map(formAssetData));
    const history = await getUserHistory({userID: name});
    let contacts = getStorage('contacts')[account.name] ? getStorage('contacts')[account.name] : [];

    if (!contacts || contacts.length === 0) {
        if (account.blacklisted_accounts.length) {
            let blacklisted_accounts = await contactsInfo(account, 'blacklisted_accounts', 2).then(e => e);
            let whitelisted_accounts = await contactsInfo(account, 'whitelisted_accounts', 1).then(e => e);
            contacts = contacts.concat(blacklisted_accounts);
            contacts = contacts.concat(whitelisted_accounts);
            editStorage('contacts', {[account.name]: contacts});
        }
    }

    let createdAssets = [];

    if(fullAcc.assets){
        createdAssets = await dbApi('get_assets', [fullAcc.assets]).then(assetsList => {
            return Promise.all(assetsList.map(async el => {
                const dynamicData = await dbApi('get_objects', [[el.dynamic_asset_data_id]]);
                const asset = await formAssetData({...el, amount: dynamicData[0].current_supply});
                const maxSupply = asset.setPrecision(true, el.options.max_supply);
                let assetType = 'issued';
                let canBeIssued = true;

                if(el.bitasset_data_id){
                    canBeIssued = false;
                    assetType = await dbApi('get_objects', [[el.bitasset_data_id]])
                        .then(e => e[0].is_prediction_market ? 'prediction' : 'smart');
                }

                const openIssueModal = () => getPassword(password => setModal(
                    <IssueAsset
                        password={password}
                        assetWithSupply={asset}
                        maxSupply={maxSupply}
                    />
                ));

                const actions = <div className="actions__wrapper">
                    <div className="actions__on-hover" style={{marginRight:'auto'}}>
                        {canBeIssued &&
                            <button onClick={openIssueModal} ><IconSend/></button>
                        }
                        <Link to={`/asset/${asset.symbol}/update`}><IconCreate /></Link>
                    </div>
                </div>;

                return {
                    symbol: el.symbol,
                    supply: asset.setPrecision(true),
                    assetType: <Translate content={`createdAssets.${assetType}`} />,
                    maxSupply,
                    actions
                };
            }));
        });
    }

    const keys = {
        active,
        owner,
        memo: {memo_key: options.memo_key}
    };

    const membership = await formMembershipData(fullAcc);

    return {id, name, assets, history, keys, limit_orders, call_orders, votes, membership, contacts, createdAssets, sidechainAccounts};
};
