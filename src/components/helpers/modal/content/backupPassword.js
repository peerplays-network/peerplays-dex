import React, { Fragment, useEffect, useState } from "react";
import Translate from "react-translate-component";

import { setNewAccount } from "../../../../actions/account";
import InfoBlock from "../../infoBlock";
import ModalTitle from "../decoration/modalTitle";




const BackupPassword = (data) => {
    const downloadPrivateKeys = (privateKeys, password) => {
        const element = document.createElement("a");
        const fileContents = `
              \n  ###### Active key ######
              \n ${privateKeys.active}
              \n
              \n  ###### Owner key ######
              \n ${privateKeys.owner}
              \n
              \n ##### memo key #####
              \n ${privateKeys.memo}
              \n
              \n ##### master password #####
              \n ${password}
            `;
        const file = new Blob([fileContents], {
          type: "text/plain",
        });
        element.href = URL.createObjectURL(file);
        element.download = `${data.accountData.name}.txt`;
        element.id = "download-keys";
        document.body.appendChild(element);
        element.click();
        element.remove();
    };


    return (
        <Fragment>
            <ModalTitle tag="backupPassword" />
            <div className="modal__content">
                <InfoBlock className="info-block__text info-block__marginBottom" tag="modal.backupPassword.forgetPassword" />
                <InfoBlock className="info-block__text info-block__marginBottom" tag="modal.backupPassword.keyDetails" />
                <InfoBlock className="info-block__text info-block__marginBottom" tag="modal.backupPassword.keepSafe" />
                <InfoBlock className="info-block__text info-block__marginBottom" tag="modal.backupPassword.whaleVaultImport" />

                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <button className="btn btn-round" onClick={() => {downloadPrivateKeys(data.wifs, data.password); setNewAccount(data)}} >
                        <Translate content="modal.backupPassword.download" />
                    </button>
                </div>
            </div>

        </Fragment>
    );
}

export default BackupPassword;