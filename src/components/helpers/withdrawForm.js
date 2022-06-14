import React, {Fragment} from 'react';
import Form from "./form/form";
import {transfer} from "../../actions/forms";
import {getAccountData} from "../../actions/store";
import Input from "./form/input";
import Textarea from "./form/textarea";
import Translate from "react-translate-component";
import RoundButton from "./buttons/roundButton";
import Close from "./modal/decoration/close";
import Submit from "./modal/decoration/submit";

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
                            <Translate content="field.labels.fee"/>
                            <span>{data.fee.toString()}</span>
                        </div>
                        {Boolean(data.gateFee) &&
                            <div className="form__row">
                                <Translate content="field.labels.gateFee" />
                                <span>{data.gateFee} {symbol}</span>
                            </div>
                        }
                        {transactionError && transactionError !== "" ? 
                            <div className="form__row">
                                <span className="clr--negative">
                                    <Translate className="" content={`errors.${transactionError}`} />
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