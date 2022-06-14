import React, {Component, Fragment} from 'react';
import Form from "../form";
import Input from "../input";
import Dropdown from "../dropdown";
import SelectHeader from "../selectHeader";
import {store} from '../../../index.js';
import {removeModal} from "../../../dispatch/setModal";
import {transfer} from "../../../actions/forms/index";
import Textarea from "../textarea";
import Translate from 'react-translate-component';

const getUserAssetsList = async (symbol) => (
    getAccountData().assets
        .filter(item => item ? item.symbol : [])
        .map(item => item.symbol)
);

class SendModal extends Component {

    state = {
        defaultData: false,
        userTokens: false
    };

    componentDidMount(){
        const {defaultFrom, defaultToken, password, keyType} = this.props;
        const userTokens = store.getState().account.assets;
        const startAsset =  defaultToken || userTokens[0].symbol;

        const defaultData = {
            from: defaultFrom || '',
            keyType: keyType,
            password: password,
            quantityAsset: startAsset,
            fee: 0,
            feeAsset: startAsset
        };

        this.setState({userTokens, defaultData});
    }

    handleTransfer = () => removeModal();

    render(){

        const {defaultData, userTokens} = this.state;

        if(!userTokens) return <span />;

        return (
            <Fragment>
                <div className="modal__header">
                    <h2 className="modal__title">Send</h2>
                </div>
                <Form
                    type={'transfer'}
                    defaultData={defaultData}
                    requiredFields={['to', 'quantity']}
                    action={transfer}
                    handleResult={this.handleTransfer}
                >
                    {
                        form => {

                            const {errors, data, transactionError} = form.state;

                            return(
                                <Fragment>
                                    <div className="modal__content">
                                        <Input
                                            name="from"
                                            labelTag="send.from"
                                            className="with-bg"
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                            disabled
                                        />
                                        <Input
                                            name="to"
                                            labelTag="send.to"
                                            type="text"
                                            className="with-bg"
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                        />
                                        <div className="quantity-wrapper">
                                            <Input
                                                name="quantity"
                                                labelTag="send.quantity"
                                                type="number"
                                                className="with-bg"
                                                onChange={form.handleChange}
                                                error={errors}
                                                value={data}
                                            />
                                            <FieldWithHint
                                                name="quantityAsset"
                                                method={getUserAssetsList}
                                                hideLabel={true}
                                                handleChange={form.handleChange}
                                                errors={errors}
                                                defaultVal = {data}
                                                readOnly={true}
                                            />
                                        </div>
                                        <Textarea
                                            name="memo"
                                            labelTag="send.memo"
                                            comment="send.memoComment"
                                            className="with-bg"
                                            onChange={form.handleChange}
                                            error={errors}
                                            value={data}
                                        />
                                        <div className="quantity-wrapper">
                                            <div>
                                                Fee: {data.fee} {data.quantityAsset}
                                            </div>
                                            {transactionError && transactionError !== "" ? 
                                            <span className="clr--negative">
                                                <Translate className="" content={`errors.${transactionError}`} />
                                            </span> 
                                            : ""}
                                            {/*<Dropdown*/}
                                            {/*btn={<SelectHeader*/}
                                            {/*text={form.state.data.feeAsset}*/}
                                            {/*className="with-bg"*/}
                                            {/*/>}*/}
                                            {/*list={userTokens.map(e => <button onClick={() => form.handleChange(e.symbol, 'feeAsset')} type="button">{e.symbol}</button>)}*/}
                                            {/*/>*/}
                                        </div>
                                    </div>
                                    <div className="modal__bottom">
                                        <button onClick={removeModal} className="modal__button" type="button">Cancel</button>
                                        <button className="modal__button" type="submit">Send</button>
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