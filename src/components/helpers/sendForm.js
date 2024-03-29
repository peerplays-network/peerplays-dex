import React, {Component, Fragment} from 'react';
import Input from "./form/input";
import Form from "./form/form";
import {transfer} from "../../actions/forms";
import Textarea from "./form/textarea";
import {defaultToken} from "../../params/networkParams";
import {getAccountData, getBasicAsset} from "../../actions/store";
import FieldWithHint from "./form/fieldWithHint";
import { utils } from '../../utils';
import { dbApi } from '../../actions/nodes';
import counterpart, { translate } from 'counterpart';


const getSymbolsList = async (symbol) => (
    getAccountData().contacts
        .filter(item => item.type !== 2 && item.name.includes(symbol))
        .map(item => item.name)
);

const getUserAssetsList = async (symbol) => (
    getAccountData().assets
        .filter(item => item ? item.symbol : [])
        .map(item => item.symbol)
);

const MEMO_MAX_LENGTH = 256;

class SendForm extends Component {
    state = {
        sended: false,
        defaultData: false,
        userTokens: false,
        assets: false
    };

    componentDidMount() {
        dbApi('list_assets', ['', 100]).then(assets => {
            this.setState({assets})
        })
        const user = getAccountData();
        const userTokens = user.assets;
        const startAsset = userTokens.length ? userTokens[0].symbol : defaultToken;
        const contacts = getAccountData().contacts.filter(item => item.type !== 2).map(item => item.name);
        const basicAsset = getBasicAsset().symbol;
        const defaultData = {
            from: user.name,
            quantityAsset: startAsset,
            fee: 0,
            feeAsset: basicAsset,
            contacts: contacts || [],
            quantity: 0,
            memo: '',
            to: ''
        };

        this.setState({userTokens, defaultData});
    }

    handleTransfer = (data) => {
        const context = this;
        this.setState({sended: true}, () => setTimeout(() => context.setState({sended: false}), 5000));

        if(this.props.update) {
            this.props.update();
        }
    };

   render() {
        const {sended, defaultData, userTokens, assets} = this.state;

        if (!defaultData) return <span/>;

        return (
            <div className="card__content">
                <Form
                    type={'transfer'}
                    className="form__send"
                    defaultData={defaultData}
                    requiredFields={['to', 'quantity']}
                    action={transfer}
                    handleResult={this.handleTransfer}
                    needPassword
                    keyType="active"
                >
                    {
                        form => {
                            const {errors, data, transactionError} = form.state;

                            return (
                                <Fragment>
                                    <div className="input__row">
                                        <Input
                                            name="from"
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                            disabled
                                        />
                                        <Input
                                            name="quantity"
                                            type="number"
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                            onKeyPress={(e) => {
                                                if (!utils.isNumberKey(e)) {
                                                  e.preventDefault();
                                                }
                                            }}
                                            precision={assets && assets.find(asset => asset.symbol === data.quantityAsset).precision}
                                            min={0}
                                        />
                                    </div>
                                    <div className="input__row">
                                     {
                                          data.contacts && data.contacts.length > 0 ? 
                                          <FieldWithHint
                                              name="to"
                                              handleChange={form.handleChange}
                                              errors={errors}
                                              defaultHints={data.contacts}
                                              defaultVal = {data}
                                          />
                                          :
                                          <Input
                                              name="to"
                                              type="text"
                                              onChange={form.handleChange}
                                              error={errors}
                                              value={data}
                                          />
                                    }
                                    <FieldWithHint
                                                name="quantityAsset"
                                                method={getUserAssetsList}
                                                id="form"
                                                hideLabel={true}
                                                handleChange={form.handleChange}
                                                errors={errors}
                                                defaultVal = {data}
                                                readOnly={true}
                                            />
                                    </div>
                                    <div className="input__row">
                                        <Textarea   
                                            name="memo"
                                            maxLength={MEMO_MAX_LENGTH}
                                            className="memo"
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                            labelTag="field.labels.publicMemo"
                                        />
                                    </div>
                                    <div className="btn__row">
                                        <span>
                                            <span>{counterpart.translate(`field.labels.fee`)}</span>{data.fee} {data.feeAsset}
                                        </span>
                                        {sended && 
                                            <span className="clr--positive">{counterpart.translate(`success.transCompleted`)}</span>
                                        }
                                        {transactionError && transactionError !== "" ? 
                                            <span className="clr--negative">
                                                {counterpart.translate(`errors.${transactionError}`)}
                                            </span> 
                                            : ""}
                                        <button type="submit" className="btn-round btn-round--send">
                                            {counterpart.translate(`block.send.title`)}
                                        </button>
                                    </div>
                                </Fragment>
                            )
                        }
                    }
                </Form>
            </div>
        )
    }
}

export default SendForm;