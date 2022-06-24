import { formAccount, getStoragedAccount } from ".";
import CloudAccount from "../../classes/cloudAccount";
import { setAccount } from "../../dispatch/setAccount";
import { getStore } from "../store";

export const updateAccountAndLoginData = async () => {
    const account = getStoragedAccount();
    const {loginData} = getStore();
    let userData = false;

    if (account.type) {
        userData = await formAccount(account.name);
    }

    if (userData) {
        setAccount({
            loginData: loginData.type !== "" ? loginData : new CloudAccount(),
            accountData: userData
        });
    }
}