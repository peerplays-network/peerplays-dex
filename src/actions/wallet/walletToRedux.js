import {formAssetData} from "../assets/index";
import {formUserAssets} from "../../components/helpers/quantityConverter";
import {formAccount} from "../account/index";
import {dbApi} from "../nodes/index";
import Wallet from "../../classes/wallet";
import {roundNum} from "../../actions/roundNum";
import {defaultQuote} from "../../params/networkParams";

const formQuantity = async (list, assetSymbol = defaultQuote) => {
    let quantity = 0;
    return await Promise.all(list.map(async asset => {
        const price = assetSymbol === asset.symbol ? 1 : await dbApi('get_ticker', [assetSymbol, asset.symbol]).then(e => e.latest);
        quantity = quantity + (price * asset.amount);
    })).then(() => roundNum(quantity));
};

export const walletToRedux = async localData => {

    const {wallet, linked_accounts} = localData.walletData;

    let accountData = '';
    let loginData = new Wallet(wallet[0]);

    const walletsList = await Promise.all(linked_accounts.map(async (acc, id) => {
        let userName = acc.name;
        let assetsList = '';

        if(id === localData.activeUser) {
            accountData = await formAccount(userName);
            assetsList = accountData.assets;
        } else {
            const balances = await dbApi('get_named_account_balances', [userName]);
            assetsList = await Promise.all(balances.map(formAssetData))
        }

        const balance = await formUserAssets(assetsList).then(formQuantity);

        return { id, userName, balance }
    }));

    return { accountData, loginData, walletsList };
};