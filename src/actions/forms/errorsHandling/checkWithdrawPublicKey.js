export const checkWithdrawPublicKey = ({withdrawPublicKey}) => {
    if(withdrawPublicKey.match(/^  *$/) !== null) return 'required'
    if(withdrawPublicKey.length !== 66 && withdrawPublicKey.length !== 130) return 'invalid_public_key'
    if(!/^[a-zA-Z0-9]*$/.test(withdrawPublicKey)) return 'invalid_public_key'
}
