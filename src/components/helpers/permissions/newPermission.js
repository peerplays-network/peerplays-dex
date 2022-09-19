import React, {Component} from 'react';
import Input from "../form/input";
import {dbApi} from "../../../actions/nodes";
import IconCross from "../../../svg/cross.svg";

const checkKey = async (val, type, prevKeys) => {
    if(val === '') return '';

    const isKey = val.length === 54;
    const alreadyUsed = prevKeys ? prevKeys.find(el => el.key === val) : false;

    if(alreadyUsed) return isKey ? 'keyUsed' : 'accUsed';

    if(isKey){
        const findKey = await dbApi('get_key_references', [[val]]);

        return findKey ? '' : 'noKey';
    }

    const findUser = await dbApi('get_full_accounts', [[val], false]).catch(() => false);

    return findUser ? '' : 'noAcc';
};

class NewPermission extends Component{

    state = {
        id: this.props.id,
        errors: {},
        data: {
            keyType: 'key_auths',
            key: '',
            weight: 1,
        }
    };

    handleKey = (val) => {
        const {data, errors} = this.state;
        const {type, prevKeys} = this.props;

        data['key'] = val;
        data['keyType'] = val.length === 54 ? 'key_auths' : 'account_auths';

        checkKey(val, type, prevKeys).then(error => {

            if(!error){
                delete errors['key'];
            } else {
                errors['key'] = error;
            }

            this.sendData(data, errors);
        });
    };

    handleWeight = (val) => {
        const {data, errors} = this.state;

        data['weight'] = val;

        if(val === '') errors['weight'] = 'emptyField';
        else if(isNaN(val)) errors['weight'] = 'isNan';
        else if(val <= 0) errors['weight'] = 'nullWeight';

        this.sendData(data, errors);
    };

    sendData = (data, errors) => {
        const {type, id} = this.props;
        const hasErrors = !!Object.keys(errors).length;
        const dataToSend = {...data, ...{ type }};
        this.setState({data, errors});
        this.props.handleChange(id, {data: dataToSend, hasErrors});
    };

    deletePerm = () => this.props.handleDelete(this.props.id);

    render(){

        const {errors, data} = this.state;

        return(
            <div className="permissions__new-item">
                <Input
                    name="key"
                    hideLabel={true}
                    onBlur={this.handleKey}
                    error={errors}
                    value={data}
                />
                <Input
                    name="weight"
                    hideLabel={true}
                    onChange={this.handleWeight}
                    error={errors}
                    value={data}
                />
                <button type="button" onClick={this.deletePerm}><IconCross /></button>
            </div>
        )
    }
}

export default NewPermission;