import React, {Component, Fragment} from 'react';
import Form from "../../form/form";
import Input from "../../form/input";
import DateField from "../../form/dateField";
import {trxBuilder} from "../../../../actions/forms/trxBuilder";
import Close from "../decoration/close";
import ModalTitle from "../decoration/modalTitle";
import Submit from "../decoration/submit";
import ModalWarning from "../decoration/modalWarning";
import {clearLayout} from "../../../../dispatch";
import {getStore, getGlobals} from "../../../../actions/store";
import { utils } from '../../../../utils';
import counterpart from 'counterpart';

const createWorker = async (data, result) => {

    const {accountData, loginData} = getStore();
    const {fees, basicAsset} = getGlobals();

    const type = 'worker_create';
    const owner = accountData.id;

    const fee = {
        amount: fees[type].fee,
        asset_id: basicAsset.id
    };

    const {
        newWorkerName = '',
        dateBegin = {},
        dateEnd = {},
        dailyPay = 0,
        website = '',
        vesting = 0
    } = data;

    const trx = {
        type,
        params: {
            fee,
            owner,
            work_begin_date: dateBegin,
            work_end_date: dateEnd,
            daily_pay: basicAsset.addPrecision(false, dailyPay),
            name: newWorkerName,
            url: website,
            initializer: [1, {pay_vesting_period_days: vesting}]
        }
    };

    const password = data.password;
    const keyType = data.keyType;
    let activeKey = '';

    if(keyType === 'password') {
        activeKey = loginData.formPrivateKey(password, 'active');
    } else if(keyType === 'active') {
        activeKey = loginData.formPrivateKey(password);
    } else if(keyType === 'whaleVault') {
        activeKey = {whaleVaultInfo:{keyType:"active", account: accountData.name}}
    }

    try {
        const trxResult = await trxBuilder([trx], [activeKey]);
        if(trxResult){
            result.success = true;
            result.callbackData = trxResult;
        }
        return result;
    } catch(e) {
        result.transactionError = e.message.toLowerCase().split(":")[0].replace(/\s+/g,"_");
        return result;
    }   

};

class AddNewWorker extends Component {

    state = {
        defaultData: false
    };

    componentDidMount(){
        const defaultData = {
            keyType: this.props.keyType,
            password: this.props.password,
            dateBegin: new Date(new Date().getTime() + 1000*60*60*24),
            dateEnd: new Date(new Date().getTime() + 1000*60*60*24*366),
            vesting: 7
        };
        this.setState({defaultData})
    }

    handleResult = () => clearLayout();

    render() {

        const tag = "newWorker";
        const defaultData = this.state.defaultData;

        if(!defaultData) return <span />;

        return(
            <Fragment>
                <ModalTitle tag={tag} />
                <ModalWarning tag={tag} />
                <Form
                    requiredFields={['newWorkerName', 'dateBegin', 'dateEnd', 'dailyPay', 'vesting']}
                    defaultData={defaultData}
                    action={createWorker}
                    handleResult={this.handleResult}
                >
                    {
                        form => <Fragment>
                            <div className="modal__content">
                                <Input
                                    name="newWorkerName"
                                    comment={true}
                                    onChange={form.handleChange}
                                    error={form.state.errors}
                                    value={form.state.data}
                                />
                                <div className="form__row">
                                    <DateField
                                        name="dateBegin"
                                        selected={form.dateBegin}
                                        onChange={form.handleChange}
                                        error={form.state.errors}
                                        value={form.state.data}
                                    />
                                    <DateField
                                        name="dateEnd"
                                        selected={form.dateBegin}
                                        onChange={form.handleChange}
                                        error={form.state.errors}
                                        value={form.state.data}
                                    />
                                </div>
                                <Input
                                    name="dailyPay"
                                    type="number"
                                    comment={true}
                                    className="big-margin"
                                    onChange={form.handleChange}
                                    error={form.state.errors}
                                    value={form.state.data}
                                    onKeyPress={(e) => {
                                        if (!utils.isNumberKey(e)) {
                                          e.preventDefault();
                                        }
                                    }}
                                />
                                <Input
                                    name="website"
                                    onChange={form.handleChange}
                                    error={form.state.errors}
                                    value={form.state.data}
                                />
                                <Input
                                    name="vesting"
                                    onChange={form.handleChange}
                                    error={form.state.errors}
                                    value={form.state.data}
                                />
                            </div>
                            <div className="info__row">
                                {form.state.transactionError && form.state.transactionError !== "" ? 
                                    <span className="clr--negative">
                                        <span>{counterpart.translate(`errors.${form.state.transactionError}`)}</span>
                                    </span> 
                                    : ""}
                            </div>
                            <div className="modal__bottom">
                                <Close />
                                <Submit tag="publish" />
                            </div>
                        </Fragment>
                    }
                </Form>
            </Fragment>
        )

    }
}

export default AddNewWorker;