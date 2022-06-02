import {TransactionBuilder} from "peerplaysjs-lib";

export const trxBuilder = async (trx, keys) => {
    const newKeys = [{whaleVaultInfo:{keyType:"active", account:"ali6666"}}]
    const tr = new TransactionBuilder();
    await trx.forEach(elem => tr.add_type_operation(elem.type, elem.params));
    await tr.set_required_fees();
    await newKeys.forEach(elem => tr.add_signer(elem));
    console.log("this is tr", tr)  

    return tr.broadcast();
};