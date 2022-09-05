import React from "react";

export const MarginsActions = ({hover}) => (
    <div className="contact__icons actions__wrapper">
        <div className="actions__on-hover">
            {hover.map(el => el)}
        </div>
    </div>
);