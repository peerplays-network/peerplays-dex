import counterpart from 'counterpart';
import React from 'react';
import IconCaret from "../../svg/caret.svg";

const SelectHeader = ({labelTag, text, className = '', error, style = {}}) => (
    <div className={`field ${className}${!labelTag ? ' without-label' : ''}`} style={style}>
        { labelTag && <span className={`field__label${text || text === 0 ? ' squeezed' : ''}`}>{counterpart.translate(`${labelTag}`)}</span> }
        <span className="field__text">
            {text}
        </span>
        <span className="field__border" />
        <IconCaret className='field__caret'/>
        { error && <span className="field__error">{counterpart.translate(`errors.${error}`)}</span> }
    </div>
);

export default SelectHeader;