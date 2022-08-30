import counterpart from "counterpart";
import React from "react";

const TitleWrapper = ({title, titleData, subtitle, subtitleData, className}) => (
    <div className={`title${className ? ` ${className}` : ''}`}>
        <h2 className="title__text">
            {counterpart.translate(`${title}`, {titleData})}
        </h2>
        {subtitle &&
            <div className="title__subtitle">{counterpart.translate(`${subtitle}`, {subtitleData})}</div>
        }
    </div>
);

export default TitleWrapper;