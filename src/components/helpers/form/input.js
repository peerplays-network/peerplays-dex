import React from 'react';
import { getAssetBySymbol } from '../../../actions/assets';
import { utils } from '../../../utils';
import FieldWrapper from "./fieldWrapper";

const Input = (props) => {

    const {
        id,
        name = '',
        type = 'text',
        disabled = false,
        formData,
        onKeyPress,
        onBlur,
        precission,
        min,
    } = props;

    let onChange = formData ? formData.handleChange : props.onChange;

    if(disabled) onChange = '';

    const value = formData ? formData.state.data : (props.value || {});

    return (
        <FieldWrapper {...props}>
            <input
                id={id ? id : name}
                name={name}
                defaultValue={value[name]}
                type={type}
                disabled={disabled}
                onKeyPress={onKeyPress ?  onKeyPress : null}         
                onChange={onChange ? (e) => {
                    if(precission && precission !== "") {
                        e.target.value = utils.roundNum(e.target.value, Number(precission));
                    } 
                    onChange(e.target.value, name)
                } : (e) => {
                    e.preventDefault()
                } }
                onBlur={e => onBlur ? onBlur(e.target.value, name) : e.preventDefault()}
                placeholder=" "
                min={min}
                className="field__input"
                autoComplete="new-password"
            />
        </FieldWrapper>
    );
};

export default Input;