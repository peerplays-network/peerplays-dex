import React from "react";
import RoundButton from "../../helpers/buttons/roundButton";
import Link from "react-router-dom/es/Link";
import {connect} from "react-redux";
import Translate from "react-translate-component";
import {openWarning} from "../../../actions/openWarning";
import {getGlobals} from "../../../actions/store";
import {Asset} from "../../../classes";
import {MembershipTitle} from "../../helpers/membershipTitle";
import PendingFees from "../../helpers/pendingFees";
import {testnetCheck} from "../../../params/networkParams";

const allocationKeys = ['network', 'reviewer', 'registrar', 'referrer', 'expiration'];

const Membership = ({account}) => {

    const {isLifetimeMember, feesPaid, allocation} = account.membership;
    const {fees, basicAsset} = getGlobals();

    const feeAsset = new Asset({...basicAsset, amount: fees.account_upgrade.membership_lifetime_fee});
    const {origin, hostname} = window.location;

    const link = origin;
    const name = account.name;

    return (
        <div className="membership">
            {!isLifetimeMember
                ? <div className="membership__block">
                    <MembershipTitle title="upgradeTitle" subtitle="upgradeDesc" subtitleData={{fee: feeAsset.toString()}} />
                    <RoundButton tag="buyMembership" onClick={() => openWarning('account_upgrade')}/>
                </div>
                : <div className="membership__block">
                    <MembershipTitle title="referralTitle" subtitle="referralDesc" subtitleData={{name, link}} />
                </div>
            }
            <div className="membership__block">
                <MembershipTitle title="allocationTitle" subtitle="allocationDesc" subtitleData={{name}} />
                {allocationKeys.map((key, id) => {
                    const item = allocation[key];
                    return (
                        <div key={id} className="statistic">
                            <div className="statistic__key">
                                <Translate content={`membership.${key}`} className="statistic__title" />
                                {item.user && <Link to={`/user/${item.user}`} className="statistic__link">{item.user}</Link>}
                            </div>
                            <span className="statistic__value">
                                {item.percent || item.percent === 0 ? `${item.percent}%` : item.date}
                            </span>
                        </div>
                    )
                })}
            </div>
            <div className="membership__block">
                <MembershipTitle title="statistics" />
                <div className="statistic">
                    <div className="statistic__key">
                        <Translate content="membership.totalFee" className="statistic__title" />
                    </div>
                    <span className="statistic__value">{feesPaid}</span>
                </div>
            </div>
            <PendingFees name={name} />
            <MembershipTitle title="vestingTitle" subtitle="vestingDesc" subtitleData={{symbol: feeAsset.symbol}} />
        </div>
    );
}

const mapStateToProps = state => ({account: state.accountData});

export default connect(mapStateToProps)(Membership);