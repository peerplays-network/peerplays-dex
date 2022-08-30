import counterpart from "counterpart";
import React from "react";

export const MembershipTitle = ({title, subtitle, subtitleData}) => (
    <div className="membership__title-wrapper">
        <h2 className="membership__title">
            {counterpart.translate(`membership.${title}`)}
        </h2>
        { subtitle && <span className="membership__subtitle">{counterpart.translate(`membership.${subtitle}`, {subtitleData})}</span> }
    </div>
);