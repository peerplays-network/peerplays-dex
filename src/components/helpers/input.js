import counterpart from 'counterpart';
import React from 'react';

const Input = ({
   name = '',
   labelTag,
   value,
   type = 'text',
   comment = '',
   className = '',
   error = '',
   disabled = false,
   onChange,
   onBlur
}) => (
    <label htmlFor={name} className={`field ${className}${error[name] ? ' error' : ''}${!labelTag ? ' without-label' : ''}`}>
        <input
            id={name}
            name={name}
            defaultValue={value[name]}
            type={type}
            disabled={disabled}
            onChange={e => onChange ? onChange(e.target.value, name) : e.preventDefault()}
            onBlur={e => onBlur ? onBlur(e.target.value, name) : e.preventDefault()}
            placeholder=" "
            className="field__input"
        />
        { labelTag && <span className={`field__label${value[name] ? ' squeezed' : ''}`}>{counterpart.translate(`${labelTag}`)}</span>  }
        { error && error[name] && <span className="field__error">{counterpart.translate(`errors.${error[name]}`)}</span>  }
        { comment && error && !error[name] && <span className="field__comment">{counterpart.translate(`${comment}`)}</span> }
    </label>
);

export default Input;