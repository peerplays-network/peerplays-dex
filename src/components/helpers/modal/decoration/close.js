import React from "react";
import {clearLayout} from "../../../../dispatch/layoutDispatch";
import Button from "../../buttons/button";
import ModalButton from "../../buttons/modalButton";

const Close = ({tag = 'cancel', onClick}) => <ModalButton tag={tag} onClick={onClick? onClick : clearLayout} />;

export default Close;