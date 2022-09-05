import React from 'react';
import Dropdown from "./dropdown";
import IconMore from "../../svg/more.svg";

const ActionsBtn = ({actionsList}) => (
    <Dropdown
        btn={<IconMore className="btn btn--icon" />}
        list={actionsList}
        position="top-center"
    />
);

export default ActionsBtn;