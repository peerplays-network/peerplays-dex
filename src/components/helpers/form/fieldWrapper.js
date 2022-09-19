import counterpart from 'counterpart';
import React from 'react';

const FieldWrapper = (props) => {

    let {
        id,
        name = '',
        labelTag,
        hideLabel,
        labelParams,
        commentParams,
        comment,
        className,
        style = {},
        wrapperStyle = {},
        formData,
        children
    } = props;

    const value = formData ? formData.state.data : (props.value || {});
    const error = formData ? formData.state.errors : (props.error || {});

    return (
        <div className="label__wrapper" style={wrapperStyle}>
            <label htmlFor={id ? id : name} className={`field ${className}${error[name] ? ' error' : ''}${hideLabel ? ' without-label' : ''}`} style={style}>
                { children }
                { !hideLabel && 
                    <span className={`field__label${value[name] ? ' squeezed' : ''}`}>
                        {counterpart.translate(`${labelTag ? labelTag : `field.labels.${name}`}`, labelParams)}
                    </span> 
                }
                { comment && !error[name] && <span className="field__comment">{counterpart.translate(`field.comments.${name}`, commentParams)}</span>  }
                <span className="field__border" />
            </label>
            { error[name] && <span className="field__error">{counterpart.translate(`errors.${error[name]}`)}</span> }
        </div>
    );
};

export default FieldWrapper;
