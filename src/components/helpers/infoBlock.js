import counterpart from "counterpart";
import React from "react";
import {IconInfo} from "../../svg";

const InfoBlock = ({tag, data, className = ''}) => (
    <div className="info-block">
        <div className="info-block__icon">
            <IconInfo />
        </div>
        <span className={ className? className : "info-block__text"}>
            {counterpart.translate(`${tag}`, {data})}
        </span>
    </div>
);

export default InfoBlock;