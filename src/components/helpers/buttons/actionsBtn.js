import React from 'react';
import Dropdown from "../form/dropdown";
import IconMore from "../../../svg/more.svg";

const ActionsBtn = ({actionsList,className}) => (
    <Dropdown
        btn={<IconMore className="btn btn--icon" />}
        list={actionsList}
        position="top-center"
        className={className}
    />
);

export default ActionsBtn;