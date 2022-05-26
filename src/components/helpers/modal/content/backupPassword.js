import React, { Fragment, useEffect, useState } from "react";
import InfoBlock from "../../infoBlock";
import ModalTitle from "../decoration/modalTitle";




const BackupPassword = () => {

    return (
        <Fragment>
            <ModalTitle tag="backupPassword" />
            <div className="modal__content">
                <InfoBlock className="info-block__text info-block__marginBottom" tag="modal.backupPassword.forgetPassword" />
                <InfoBlock className="info-block__text info-block__marginBottom" tag="modal.backupPassword.keyDetails" />
                <InfoBlock className="info-block__text info-block__marginBottom" tag="modal.backupPassword.keepSafe" />

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button className="btn btn-round" onClick={() => {}} >Download, take me to dashboard</button>
                </div>
        

            </div>

        </Fragment>
    );
}

export default BackupPassword;