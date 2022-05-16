export const checkWithdrawPublicKey = ({withdrawPublicKey}) => {
    if(withdrawPublicKey.match(/^  *$/) !== null) return 'required'
    if(withdrawPublicKey.length < 66) return 'invalidKey'
}
