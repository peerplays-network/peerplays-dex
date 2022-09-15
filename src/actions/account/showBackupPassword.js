import React from "react";
import BackupPassword from "../../components/helpers/modal/content/backupPassword";
import { setModal } from "../../dispatch/layoutDispatch";


export const showBackupPassword =  (data) => {
   return setModal(<BackupPassword 
                     persist={true}
                     password={data.password}
                     accountData={data.accountData} 
                     localData={data.localData} 
                     loginData={data.loginData} 
                     wifs={data.wifs} 
                  />)
};