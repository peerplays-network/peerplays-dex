import React from "react";
import {QRCodeCanvas} from 'qrcode.react';
import InfoBlock from "./infoBlock";
import {Link} from "react-router-dom";
import WarningMessage from "./warningMessage";
import counterpart from "counterpart";

const DepositData = ({type, data, address, memo, user}) => {

    const {minAmount, gatewayWallet, depositCoin, withdrawCoin} = data;
    const isDeposit = type === 'deposit';
    const inputAsset = isDeposit ? depositCoin.toUpperCase() : withdrawCoin.toUpperCase();
    const outputAsset = isDeposit ? withdrawCoin.toUpperCase() : depositCoin.toUpperCase();
    const minDeposit = `${minAmount} ${inputAsset}`;

    return(
        <div>
            { isDeposit && !memo && <QRCodeCanvas value={address} size={170} /> }
            {isDeposit &&
                <div className="deposit__info">
                    <InfoBlock tag="deposit.address" data={{inputAsset, outputAsset, address: <b>{address}</b>}}/>
                    {isDeposit && memo && <InfoBlock tag="deposit.memo" data={{memo: <b>{memo}</b>}}/>}
                    <WarningMessage
                        titleTag="bridgeData.minDeposit"
                        titleData={{minDeposit}}
                        subtitleTag="bridgeData.minDepositComment"
                        subtitleData={{inputAsset, minDeposit}}
                    />
                </div>
            }
            <div className="deposit-stats">
                <div className="deposit-stats__item">
                    <span className="deposit-stats__title">
                        {isDeposit ? counterpart.translate(`bridgeData.assetToDeposit`) : counterpart.translate(`bridgeData.assetToWithdraw`)}
                    </span>
                    <Link to={`/asset/${inputAsset}`} className="deposit-stats__data">{inputAsset}</Link>
                </div>
                <div className="deposit-stats__item">
                    <span className="deposit-stats__title">
                        {counterpart.translate(`bridgeData.assetToReceive`)}
                    </span>
                    <Link to={`/asset/${outputAsset}`} className="deposit-stats__data">{outputAsset}</Link>
                </div>
                <div className="deposit-stats__item">
                    <span className="deposit-stats__title">
                        {counterpart.translate(`bridgeData.intermediateAccount`)}
                    </span>
                    <Link to={`/user/${gatewayWallet}`} className="deposit-stats__data">{gatewayWallet}</Link>
                </div>
                <div className="deposit-stats__item">
                    <span className="deposit-stats__title">
                        {counterpart.translate(`bridgeData.senderAccount`)}
                    </span>
                    <Link to={`/user/${user.name}`} className="deposit-stats__data">{user.name}</Link>
                </div>
                <div className="deposit-stats__item">
                    <span className="deposit-stats__title">
                        {counterpart.translate(`bridgeData.currentBalance`)}
                    </span>
                    <span className="deposit-stats__data">{user.balance}</span>
                </div>
            </div>
        </div>
    )
};

export default DepositData;