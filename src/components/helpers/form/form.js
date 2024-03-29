import React, { Component } from "react";
import { feeCalculator, getPassword ,sellBuy } from "../../../actions/forms/index";
import { checkErrors } from "../../../actions/forms/errorsHandling/";
import OrderConfirmationModel from "../modal/content/orderConfirmationModel";
import {setModal} from "../../../dispatch";
import {getGlobalData} from "../../../actions/dataFetching/getGlobalData";
import {setAccount} from "../../../dispatch/setAccount";

const handleData = async (context, val, id) => {
    const { mutateData, type } = context.props;
    let data = { ...context.state.data };
    const feeCalc = feeCalculator[type];
    data = Object.filter(data, data => data);

    data[id] = val;
    if (mutateData && mutateData[id]) data = mutateData[id](data);
    const errors = await checkErrors(data);
    if (feeCalc) {
        const { feeErr, feeAmount, errVariable, sellMarketFeePercent, buyMarketFeePercent } = await feeCalc(data);
        if (feeErr) errors[errVariable] = feeErr;
        data['fee'] = feeAmount;
        data['sellMarketFeePercent'] = sellMarketFeePercent
        data['buyMarketFeePercent'] = buyMarketFeePercent
    }
    return { data, errors };
};

const validateAfterSubmit = async (data, type) => {
    const errors = await checkErrors(data);
    const feeCalc = feeCalculator[type];
    if (feeCalc) {
        const { feeErr, errVariable } = await feeCalc(data);
        if (feeErr) errors[errVariable] = feeErr;
    }
    return errors
}

Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce( (res, key) => (res[key] = obj[key], res), {} );


class Form extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: props.defaultData || {},
            errors: {},
            transactionError: ""
        };
        this.validateAndSetState = this.validateAndSetState.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
        this.handleAction = this.handleAction.bind(this);
    }
    
    handleChange (val, id) {
        return handleData(this, val, id).then((result) => this.validateAndSetState(this.form, result));
    } 

    validateAndSetState (form, result) {
        this.setState(state => {
            state.errors = {};
            Object.keys(result.data).map((keyValue) => {
                if (!form[keyValue] || result.data[keyValue] === form[keyValue].value || result.data[keyValue] === form[keyValue].checked) {
                    state.data[keyValue] = result.data[keyValue];
                    if (result.errors[keyValue]) {
                        state.errors[keyValue] = result.errors[keyValue];
                    }
                }
            });
            return state
        });
    }

    async submit (e) {
        e && e.preventDefault();
        const { data } = this.state;
        const errors =  await validateAfterSubmit(data, this.props.type)
        this.setState({errors: errors})

        if (Object.keys(errors).length) return;
        
        this.setState({ loading: true });

        this.props.requiredFields && this.props.requiredFields
            .filter(el => !data[el])
            .forEach(el => errors[el] = 'required');
        this.props.requiredQuantity && this.props.requiredQuantity
            .filter(el => !data[el])
            .forEach(el => errors[el] = 'requiredQuantity')
        if (Object.keys(errors).length) {
            this.setState({ loading: false, errors});
            return;
        }
        
        const checkPassword = (keyType) => {
            this.setState({ loading: false });
            getPassword((password, keyType) => (
                this.setState(
                    { data: { ...data, password, keyType } },
                    () => this.handleAction()
                )
            ), keyType);
            return;
        }

        if (this.props.orderConfirmation) {
            this.setState({ loading: false });
            setModal(<OrderConfirmationModel onSuccess={() => { checkPassword(this.props.keyType) }} data={this.props} grid={3} />)
            return;
        }

        if(this.props.needPassword){
            checkPassword(this.props.keyType);
            return;
        }

        this.handleAction();
    };

    handleAction () {
        const data = this.state.data;
        const { action, handleResult } = this.props;
        if (action) {
         const result = {
                success: false,
                errors: {},
                callbackData: '',
                transactionError: ''
            };

            this.setState({ loading: true });
            action(data, result).then(result => {
                if (!result.success) {
                    this.setState({ loading: false, errors: result.errors });
                    if(result.transactionError && result.transactionError !== "") {
                        const context = this;
                        this.setState({transactionError: result.transactionError}, () => setTimeout(() => context.setState({transactionError: ""}), 5000));
                    }
                    return;
                }
                this.setState({ loading: false }, () => {
                    handleResult(result.callbackData);
                    this.setState({ data: this.props.defaultData });
                    this.form.reset();
                });
            });
        } else if (handleResult) {
            handleResult(this.state.data);
        }
    };

    render() {

        const { className, children } = this.props;

        return (
            <form
                onSubmit={this.submit}
                className={`form${this.state.loading ? ' loading' : ''}${className ? ` ${className}` : ''}`}
                ref={form => this.form = form}
                noValidate
            >
                {children(this)}
            </form>
        )
    }
}

export default Form;
