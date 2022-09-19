import React from 'react';
import { utils } from '../../../utils';
import FieldWrapper from "./fieldWrapper";

const Input = (props) => {

    const BROWSER_INPUT_MAX_LENGTH = 300
    const {
        id,
        name = '',
        type = 'text',
        disabled = false,
        formData,
        onKeyPress,
        onBlur,
        precision,
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
                onKeyPress={onKeyPress ? (e) => {
                    if(e.target.value.length > BROWSER_INPUT_MAX_LENGTH) {
                        e.preventDefault()
                    } else {
                        onKeyPress(e)
                    }
                } : (e) => {
                    if(e.target.value.length > BROWSER_INPUT_MAX_LENGTH) {
                        e.preventDefault()
                    }
                }}         
                onChange={onChange ? (e) => {
                    if(precision && precision !== "" &&
                        Number(e.target.value) > 0 &&
                        String(e.target.value).split(".")[1] &&
                        String(e.target.value).split(".")[1].length > Number(precision)) {
                        e.target.value = utils.roundNum(e.target.value, Number(precision));
                        onChange(utils.roundNum(e.target.value, Number(precision)), name)
                    } 
                    onChange(e.target.value, name)
                } : (e) => {
                    e.preventDefault()
                }}
                onBlur={e => onBlur ? onBlur(e.target.value, name) : e.preventDefault()}
                placeholder=""
                min={min}
                className="field__input"
                autoComplete="new-password"
            />
        </FieldWrapper>
    );
};

export default Input;