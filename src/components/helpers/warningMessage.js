import counterpart from "counterpart";
import React from "react";
import IconWarning from "../../svg/warning.svg";

const WarningMessage = ({titleTag, titleData, subtitleTag, subtitleData, className}) => (
    <div className={`warning${className ? ` ${className}` : ''}`}>
        <IconWarning/>
        <div className="warning__text-wrapper">
            <span>{counterpart.translate(`${titleTag}`, titleData)}</span>
            { subtitleTag && <span>{counterpart.translate(`${subtitleTag}`, subtitleData)}</span> }
        </div>
    </div>
);

export default WarningMessage;