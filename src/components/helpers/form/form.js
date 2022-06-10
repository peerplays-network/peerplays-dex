import React, { Component } from "react";
import { feeCalculator, getPassword, transfer } from "../../../actions/forms/index";
import { checkErrors } from "../../../actions/forms/errorsHandling/";
import OrderConfirmationModel from "../modal/content/orderConfirmationModel";
import {setModal} from "../../../dispatch";

const handleData = async (context, val, id) => {
    const { mutateData, type } = context.props;
    let data = { ...context.state.data };
    const feeCalc = feeCalculator[type];
    data = Object.filter(data, data => data);

    data[id] = val;
    if (mutateData && mutateData[id]) data = mutateData[id](data);
    const errors = await checkErrors(data);
    if (feeCalc) {
        const { feeErr, feeAmount, errVariable } = feeCalc(data);
        if (feeErr) errors[errVariable] = feeErr;
        data['fee'] = feeAmount;
    }
    return { data, errors };
};

Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce( (res, key) => (res[key] = obj[key], res), {} );


class Form extends Component {
    state = {
        loading: false,
        data: this.props.defaultData || {},
        errors: {}
    };
    handleChange = (val, id) => handleData(this, val, id)
    .then((result) => this.validateAndSetState(this.form, result));

    validateAndSetState = (form, result) => {
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

    


    submit = (e) => {
        e && e.preventDefault();
        const { errors, data } = this.state;

        if(this.props.defaultData && this.props.defaultData.password == "passwordpasswordpassword"){
            let defaultData = {...this.props.defaultData, trx:'model'}
            localStorage.setItem('sendModel',JSON.stringify(defaultData))
        }
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
        const checkPassword = () => {
            this.setState({ loading: false });
            getPassword(password => (
                this.setState(
                    { data: { ...data, password } },
                    () => this.handleAction()
                )
            ));
            return;
        }

        if (this.props.orderConfirmation) {
            this.setState({ loading: false });
            setModal(<OrderConfirmationModel onSuccess={checkPassword} data={this.props} grid={3} />)
            return;
        }

        if(this.props.needPassword){
            checkPassword();
            return;
        }

        this.handleAction();
    };

    handleAction = () => {
        let data = this.state.data;
        console.log(this.state)
        let sendModelData = JSON.parse(localStorage.getItem('sendModel'))
        if(sendModelData){
            data = {...sendModelData, password:this.state.data.password}
        }

        const { action, handleResult } = this.props;
        if (action) {
         const result = {
                success: false,
                errors: {},
                callbackData: ''
            };

            this.setState({ loading: true });

            action(data, result).then(result => {
                if (!result.success) {
                    this.setState({ loading: false, errors: result.errors });
                    return;
                }
                this.setState({ loading: false }, () => {
                    handleResult(result.callbackData);
                    if(data.trx && data.trx === 'model'){
                        transfer(data)
                        this.setState({ data: this.props.defaultData });
                        localStorage.removeItem('sendModel')
                        this.form.reset();
                        // setTimeout(() => {window.location.reload()},5000);
                    }
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
