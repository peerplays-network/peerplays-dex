import React, {Component, Fragment} from "react";
import {getAccountData, getBasicAsset} from "../../../actions/store";
import {testnetCheck} from "../../../params/networkParams";
import {getStorage} from "../../../actions/storage";
import BridgeSelector from "../../helpers/bridgeSelector";
import DepositData from "../../helpers/depositData";
import WithdrawForm from "../../helpers/withdrawForm";
import NoData from "../../helpers/noData";
import Close from "../../helpers/modal/decoration/close";
import {clearLayout} from "../../../dispatch";
import counterpart from "counterpart";

class AssetWithdraw extends Component{
    state = {
        bridgesData: false,
        bridgeData: ''
    };

    componentDidMount(){

        const defaultAsset = this.props.defaultAsset;
        const bridgesData = getStorage('bridges').bridgesData;

        if(!bridgesData) return;

        const userAssets = testnetCheck ? ['xbtsx.STH'.toUpperCase()] : getAccountData().assets.map(el => el.symbol);

        for(let key in bridgesData){
            const bridge = bridgesData[key];
            let newWithdrawalList = !defaultAsset
                ? bridge.withdrawalList
                : bridge.withdrawalList.filter(el => {
                    const defAsset = testnetCheck ? 'xbtsx.STH'.toUpperCase() : defaultAsset.toUpperCase();
                    const {symbol, withdrawCoin} = bridge.coinsList[el];
                    return [
                        symbol.toUpperCase(),
                        withdrawCoin.toUpperCase(),
                        el.toUpperCase()
                    ].includes(defAsset);
                });

            bridge.withdrawalList = newWithdrawalList.filter(el => userAssets.includes(bridge.coinsList[el].withdrawCoin));
            if(!bridge.withdrawalList.length) delete bridgesData[key];
        }

        this.setState({bridgesData})
    }

    clearData = () => {
        this.setState({coinParams: ''});
    };


    handleSelect = ({bridgeParams, coinParams}) => {
        this.setState({coinParams: ''}, () => {
            const defaultFormData = {
                ...coinParams,
                fee: getBasicAsset(),
                bridgeName: bridgeParams.name,
                baseApiUrl: bridgeParams.api.BASE,
                password: this.props.password
            };

            const currentUser = getAccountData();
            const userAsset = currentUser.assets.find(el => el.symbol === coinParams.withdrawCoin);

            const userData = {
                name: currentUser.name,
                balance: userAsset ? userAsset.toString() : `0 ${coinParams.withdrawCoin}`
            };

            this.setState({coinParams, defaultFormData, userData});
        });
    };

    handleWithdraw = () => clearLayout();

    render(){

        const {bridgesData, coinParams, userData, defaultFormData} = this.state;

        if(!bridgesData) return <span />;

        const isModal = Boolean(this.props.defaultAsset);

        if(!Object.keys(bridgesData).length) return (
            <Fragment>
                <NoData tag="emptyPage.withdraw" />
                {isModal &&
                    <div className="modal__bottom">
                        <Close />
                    </div>
                }
            </Fragment>
        );

        const depositData = <DepositData data={coinParams} user={userData} />;

        return(
            <div className="deposit">
                <div>
                    <BridgeSelector type="withdrawal" defaultData={bridgesData} handleSelect={this.handleSelect} clearData={this.clearData} />
                    {coinParams &&
                       <WithdrawForm defaultData={defaultFormData} handleResult={this.handleWithdraw} depositData={isModal && depositData} />
                    }
                </div>
                {!coinParams
                    ? <div>{counterpart.translate(`bridgeData.warning`)}</div> 
                    : !isModal && depositData
                }
            </div>
        )
    }
}

export default AssetWithdraw;