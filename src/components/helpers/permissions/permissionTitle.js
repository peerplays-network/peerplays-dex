import React from "react";
import counterpart from "counterpart";

const PermissionTitle = ({type}) => (
    <div className="permissions__title-wrapper">
        <h2 className="permissions__title">{counterpart.translate(`permissions.${type}.title`)}</h2>
        <span className="permissions__subtitle">{counterpart.translate(`permissions.${type}.subtitle`)}</span>
    </div>
);

export default PermissionTitle;