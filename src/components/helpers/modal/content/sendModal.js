import React, {Component, Fragment} from 'react';
import Form from "../../form/form";
import Input from "../../form/input";
import Dropdown from "../../form/dropdown";
import SelectHeader from "../../selectHeader";
import {transfer} from "../../../../actions/forms/index";
import Textarea from "../../form/textarea";
import Close from "../decoration/close";
import {clearLayout} from "../../../../dispatch/index";
import {getAccountData} from "../../../../actions/store/index";
import ModalTitle from "../decoration/modalTitle";
import Submit from "../decoration/submit";
import {getBasicAsset} from "../../../../actions/store";
import FieldWithHint from "../../form/fieldWithHint";
import { utils } from '../../../../utils';
import { updateAccountAndLoginData } from '../../../../actions/account';
import { dbApi } from '../../../../actions/nodes';
import counterpart from 'counterpart';

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
class SendModal extends Component {

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
        const {defaultFrom, defaultTo, defaultToken, password, keyType} = this.props;
        const contacts = getAccountData().contacts.filter(item => item.type !== 2).map(item => item.name);
        const userTokens = getAccountData().assets;

        const startAsset =  defaultToken || userTokens[0].symbol;
        const basicAsset = getBasicAsset().symbol;

        const defaultData = {
            from: defaultFrom || '',
            to: defaultTo || '',
            keyType: keyType,
            password: password,
            quantityAsset: startAsset,
            fee: 0,
            feeAsset: basicAsset,
            contacts: contacts || []
        };

        this.setState({userTokens, defaultData});
    }

    handleSend = (data) => {
        this.setState({sended: true}, () => {
        });

        updateAccountAndLoginData();

        setTimeout(() => {
            clearLayout();
        }, 1000);
    };

    render() {

        const {defaultData, userTokens, sended, assets} = this.state;

        if (!userTokens) return <span/>;

        return (
            <Fragment>
                <ModalTitle tag="send"/>
                <Form
                    type={'transfer'}
                    defaultData={defaultData}
                    requiredFields={['to', 'quantity']}
                    action={transfer}
                    handleResult={this.handleSend}
                >
                    {
                        form => {

                            const {errors, data, transactionError} = form.state;
                            
                            return (
                                <Fragment>
                                    <div className="modal__content">
                                        <Input
                                            id="modalSendFrom"
                                            name="from"
                                            error={errors}
                                            value={data}
                                            disabled
                                        />
                                        {
                                            this.props.defaultTo
                                                ?
                                                <Input
                                                    id="modalSendTo"
                                                    name="to"
                                                    className="mt-2"
                                                    type="text"
                                                    onChange={form.handleChange}
                                                    error={errors}
                                                    value={data}
                                                    disabled={true}
                                                />
                                                :
                                                data.contacts && data.contacts.length > 0 ? 
                                                <FieldWithHint
                                                    name="to"
                                                    className="mt-2"
                                                    method={getSymbolsList}
                                                    handleChange={form.handleChange}
                                                    errors={errors}
                                                    defaultHints={data.contacts}
                                                />
                                                :
                                                <Input
                                                    id="modalSendTo"
                                                    name="to"
                                                    className="mt-2"
                                                    type="text"
                                                    onChange={form.handleChange}
                                                    error={errors}
                                                    value={data}
                                                />

                                        }
                                        <div className="quantity-wrapper mt-2">
                                            <Input
                                                id="modalSendQuantity"
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
                                            />
                                            <Input
                                                id="model"
                                                name="quantityAsset"
                                                type="text"
                                                onChange={form.handleChange}
                                                error={errors}
                                                className="quantity-wrapper dropdown"
                                                hideLabel={true}
                                                value={data}
                                                defaultVal = {data}
                                                disabled={true}
                                            />
                                        </div>
                                        <Textarea
                                            id="modalSendMemo"
                                            name="memo"
                                            maxLength={MEMO_MAX_LENGTH}
                                            comment={true}
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                        />
                                        <div className="quantity-wrapper mt-2">
                                            <div>
                                                <span>{counterpart.translate(`field.labels.fee`)}</span>
                                                {data.fee} {data.feeAsset}
                                            </div>
                                            <div>
                                                {transactionError && transactionError !== "" ? 
                                                    <span className="clr--negative">
                                                        <span>{counterpart.translate(`errors.${transactionError}`)}</span>
                                                    </span> 
                                                : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal__bottom">
                                        {sended && 
                                            <h3 className="clr--positive">
                                                <span>{counterpart.translate(`success.transCompleted`)}</span>
                                            </h3>
                                        }
                                        <Close/>
                                        <Submit tag="send"/>
                                    </div>
                                </Fragment>
                            )
                        }
                    }
                </Form>
            </Fragment>
        )
    }
};

export default SendModal;