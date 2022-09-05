import counterpart from "counterpart";
import React from "react";

const Button = ({ className, tag, type = "button", onClick, disabled }) => (
    <button 
        type={type}
        className={`${className ? className : ''}`}
        onClick={onClick}
        disabled={disabled}
    >
        {counterpart.translate(`buttons.${tag}`)}
    </button>

);

export default Button;