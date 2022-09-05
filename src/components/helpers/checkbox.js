import counterpart from "counterpart";
import React from "react";
import IconCheck from "../../svg/check.svg";


const CheckBox = ({id = '', labelTag = '', value = '', className = '', onChange, disabled = false}) => {
    return(
        <label htmlFor={id} className={`checkbox${value[id] ? ' checkbox--selected' : ''}${className ? ` ${className}` : ''}${disabled ? ' disabled' : ''}`}>
            <input id={id} type="checkbox" defaultChecked={value[id]} onChange={e => onChange ? onChange(e.target.checked, id) : e.preventDefault()} disabled={disabled}/>
            {labelTag && <span className="checkbox__label">{counterpart.translate(`${labelTag}`)}</span> }
            <IconCheck />
        </label>
    )
};

export default CheckBox;