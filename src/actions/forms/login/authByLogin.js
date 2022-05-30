import {formAccount} from "../../account/formAccount";
import {getFullAccount} from "../../account/getFullAccount";
import CloudAccount from "../../../classes/cloudAccount";

export const authByLogin = async ({login, password, remember, whaleVault}, result) => {
    const fullAcc = await getFullAccount(login, true);
    console.log("auth",whaleVault)
    if(!fullAcc){
        result.errors.login = 'noAcc';
        return result;
    }

    const accData = fullAcc.account;
    const loginData = new CloudAccount();
    
    if(!whaleVault) {
        const checkPassword = loginData.checkPassword(password, accData); 
        if(!checkPassword){
            result.errors.password = 'wrongPass';
            return result;
        }
    } else {
        if (window.whalevault) {
            window.whalevault.requestSignBuffer("PPYDEX", login, "test", "", 
            $("#sb_reason").val(), $("#sb_sigtype option:selected").text(),
              function(response) {
                  console.log('whalevault response: SignBuffer');
                  console.log(response);
              });
        } else {
            result.errors.whaleVault = 'whaleNotInstalled';
            return result;
        }
        debugger
    }

    const localData = {type: 'cloud', id: fullAcc.account.id, name: fullAcc.account.name};
    const accountData = await formAccount(fullAcc);

    result.success = true;
    result.callbackData = { loginData, accountData, localData, remember };

    return result;
};