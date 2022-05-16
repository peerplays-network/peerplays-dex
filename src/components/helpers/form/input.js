import React from 'react';
import FieldWrapper from "./fieldWrapper";

const Input = (props) => {

    const {
        id,
        name = '',
        type = 'text',
        disabled = false,
        formData,
        onKeyPress,
        min,
        onBlur
    } = props;

    let onChange = formData ? formData.handleChange : props.onChange;

    let isNumberKey = (e,type)=>{
        var charCode = (e.which) ? e.which : e.keyCode
        if (type === 'number' && (charCode === 43 || charCode === 45 || charCode === 101)){
             return e.preventDefault()
        }
        if (type === 'password' && charCode === 32 ){
            return e.preventDefault()
       }
        }

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
                onKeyPress={e => isNumberKey(e,type)}
                onChange={e => onChange ? onChange(e.target.value, name) : e.preventDefault()}
                onBlur={e => onBlur ? onBlur(e.target.value, name) : e.preventDefault()}
                placeholder=" "
                min={min}
                className="field__input"
                autoComplete="off"
            />
        </FieldWrapper>
    );
};

export default Input;