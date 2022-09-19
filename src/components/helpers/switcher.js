import counterpart from 'counterpart';
import React from 'react';

const Switcher = ({id, name, className, label, selected, handleChange}) => {

    const forId = name ? `${name}-${id}` : id;

    return(
        <label htmlFor={forId} className={`switch${selected ? ' switch--selected' : ''}${className ? ` ${className}` : ''}`}>
            <input id={forId} type="checkbox" onChange={e => handleChange(e.target.checked, id)} checked={selected} />
            <span className="switch__icon" />
            <span className="switch__title">{counterpart.translate(`${label}`)}</span>
        </label>
    )
};

export default Switcher;