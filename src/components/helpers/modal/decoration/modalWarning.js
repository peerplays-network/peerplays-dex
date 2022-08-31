import counterpart from "counterpart";
import React from "react";
import {IconWarning} from "../../../../svg";

const ModalWarning = ({tag}) => (
    <div className="modal__warning">
        <IconWarning />
        <span>{counterpart.translate(`modal.${tag}.warning`)}</span>
    </div>
);

export default ModalWarning;