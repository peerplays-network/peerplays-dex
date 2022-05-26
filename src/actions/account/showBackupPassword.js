import React from "react";
import BackupPassword from "../../components/helpers/modal/content/backupPassword";
import { setModal } from "../../dispatch/layoutDispatch";


export const showBackupPassword = async (data) => {
    console.log("data", data)
   return setModal(<BackupPassword persist={true}/>)
};