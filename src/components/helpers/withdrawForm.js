import React, {Fragment} from 'react';
import Form from "./form/form";
import {transfer} from "../../actions/forms";
import {getAccountData} from "../../actions/store";
import Input from "./form/input";
import Textarea from "./form/textarea";
import RoundButton from "./buttons/roundButton";
import Close from "./modal/decoration/close";
import Submit from "./modal/decoration/submit";
import counterpart from 'counterpart';

const withdrawTokens = async (data, result) => {
    let {password, keyType, withdrawAddress, memo, gatewayWallet, withdrawCoin, withdrawAmount, minAmount, gateFee} = data;

    if(Number(withdrawAmount) < (Number(minAmount) + Number(gateFee))){
        result.errors.withdrawAmount = 'belowMinAmount';
        return result;
    }

    return transfer({
        from: getAccountData().name,
        to: gatewayWallet,
        quantityAsset: withdrawCoin,
        quantity: Number(withdrawAmount),
        memo: `${withdrawAddress}${memo ? '\n' + memo : ''}`,
        password,
        keyType
    });
};

const WithdrawForm = ({defaultData, handleResult, depositData}) => (
    <Form
        type="withdraw_trx"
        requiredFields={['withdrawAmount', 'withdrawAddress']}
        defaultData={defaultData}
        action={withdrawTokens}
        handleResult={handleResult}
        needPassword={!defaultData.password}
        keyType="active"
    >
        {
            form => {
                const {data, errors, transactionError} = form.state;
                const symbol = data.withdrawCoin.toUpperCase();
                return (
                    <Fragment>
                        <Input
                            name="withdrawAmount"
                            onChange={form.handleChange}
                            error={errors}
                            value={data}
                            comment={true}
                            commentParams={{minAmount: `${data.minAmount} ${symbol}`}}
                        />
                        <Input
                            name="withdrawAddress"
                            onChange={form.handleChange}
                            error={errors}
                            value={data}
                        />
                        {data.memoSupport &&
                        <Textarea
                            name="memo"
                            className="memo"
                            onChange={form.handleChange}
                            error={errors}
                            value={data}
                        />
                        }
                        <div className="form__row">
                            <span>{counterpart.translate(`field.labels.fee`)}</span>
                            <span>{data.fee.toString()}</span>
                        </div>
                        {Boolean(data.gateFee) &&
                            <div className="form__row">
                                <span>{counterpart.translate(`field.labels.gateFee`)}</span>
                                <span>{data.gateFee} {symbol}</span>
                            </div>
                        }
                        {transactionError && transactionError !== "" ? 
                            <div className="form__row">
                                <span className="clr--negative">
                                    <span>{counterpart.translate(`errors.${transactionError}`)}</span>
                                </span> 
                            </div>
                            : "" }
                        
                        { depositData
                            ?  <Fragment>
                                {depositData}
                                <div className="modal__bottom">
                                    <Close />
                                    <Submit tag="withdraw" />
                                </div>
                            </Fragment>
                            : <RoundButton type="submit" tag="withdraw" />
                        }

                    </Fragment>
                )
            }
        }
    </Form>
);

export default WithdrawForm;