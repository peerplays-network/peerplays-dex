import React, {Component} from 'react';
import BridgeSelector from "../../helpers/bridgeSelector";
import {testnetCheck} from "../../../params/networkParams";
import {getAccountData} from "../../../actions/store";
import DepositData from "../../helpers/depositData";
import {getStorage} from "../../../actions/storage";
import {getFullAccount} from "../../../actions/account";
import {formAssetData} from "../../../actions/assets";
import counterpart from 'counterpart';

const formDepositData = async ({bridgeParams, coinParams}, userName) => {

    const {symbol, depositCoin, withdrawCoin} = coinParams;

    let userAssets = [];

    if(!userName){
        const {name, assets} = getAccountData();
        userName = name;
        userAssets = assets;
    } else {
        const user = await getFullAccount(userName);
        userAssets = await Promise.all(user.balances.map(formAssetData));
    }

    let userAsset = userAssets.find(el => [symbol, depositCoin, withdrawCoin].includes(el.symbol));

    userAsset = userAsset ? userAsset.setPrecision() : 0;

    const userData = {
        name: userName,
        balance: `${userAsset} ${withdrawCoin.toUpperCase()}`
    };

    const outputAddress = userData.name;
    const bridgeAPI = bridgeParams.api;
    const result = {coinParams, bridgeAPI, userData, inputAddress: '', inputMemo: ''};

    if(bridgeParams.name === 'Rudex') {
        result.inputAddress = 'rudex';
        result.inputMemo = `dex:${outputAddress}`;
        return result;
    }

    const defaultAPI = '/simple-api/initiate-trade';
    const url = bridgeAPI.BASE + (bridgeAPI.NEW_DEPOSIT_ADDRESS ? bridgeAPI.NEW_DEPOSIT_ADDRESS : defaultAPI);

    const data = {
        inputCoinType: depositCoin.toLowerCase(),
        outputCoinType: withdrawCoin.toLowerCase(),
        outputAddress
    };

    await fetch(url, {method: "POST", body: JSON.stringify(data), headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }})
        .then(e => e.json())
        .then(({inputAddress, inputMemo}) => {
            result.inputAddress = inputAddress;
            result.inputMemo = inputMemo;
        });

    return result;
}

class AssetDeposit extends Component{
    state = {
        bridgesData: false,
        coinParams: false,
        userData: false
    };

    componentDidMount(){
        let defaultAsset = this.props.defaultAsset;
        let bridgesData = getStorage('bridges').bridgesData;

        if(!bridgesData) return;

        if(!defaultAsset){
            this.setState({bridgesData});
            return;
        }

        defaultAsset = testnetCheck ? 'BTC' : defaultAsset.toUpperCase();

        for(let bridgeName in bridgesData){
            const bridgeItem = bridgesData[bridgeName];
            const newDepositList = bridgeItem.depositList.filter(el => {
                   const {symbol, depositCoin} = bridgeItem.coinsList[el];
                   return [
                       symbol.toUpperCase(),
                       depositCoin.toUpperCase(),
                       el.toUpperCase()
                   ].includes(defaultAsset);
            });
            !newDepositList.length
                ? delete bridgesData[bridgeName]
                : bridgeItem.depositList = newDepositList;
        }

        this.setState({bridgesData});
    }

    clearData = () => {
        this.setState({coinParams: false, userData: false});
    };

    handleSelect = (data) => {
        this.clearData();
        formDepositData(data, this.props.defaultUser).then(result => this.setState(result));
    };

    render(){
        const {bridgesData, coinParams, userData, inputAddress, inputMemo} = this.state;

        if(!bridgesData) return <span />;

        return(
            <div className="deposit">
                <BridgeSelector type="deposit" defaultData={bridgesData} handleSelect={this.handleSelect} clearData={this.clearData} />
                {coinParams
                    ? <DepositData type="deposit" data={coinParams} user={userData} address={inputAddress} memo={inputMemo} />
                    : <div>{counterpart.translate(`bridgeData.warning`)}</div>
                }
            </div>
        )
    }
}

export default AssetDeposit;