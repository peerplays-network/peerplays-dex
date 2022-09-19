import counterpart from 'counterpart';
import React from 'react';

const Textarea = ({
  name = '',
  labelTag,
  value,
  comment = '',
  className = '',
  error = '',
  disabled = false,
  onChange
}) => (
    <label htmlFor={name} className={`field ${className}${error[name] ? ' error' : ''}${!labelTag ? ' without-label' : ''}`}>
        <textarea
            id={name}
            name={name}
            defaultValue={value[name]}
            disabled={disabled}
            onChange={e => onChange ? onChange(e.target.value, name) : e.preventDefault()}
            placeholder=" "
            className="field__input"
        />
        { labelTag && <span className={`field__label${value[name] ? ' squeezed' : ''}`}>{counterpart.translate(`${labelTag}`)}</span> }
        { error[name] && <span className="field__error">{counterpart.translate(`errors.${error[name]}`)}</span> }
        { comment && !error[name] && <span className="field__comment">{counterpart.translate(`${comment}`)}</span> }
    </label>
);

export default Textarea;