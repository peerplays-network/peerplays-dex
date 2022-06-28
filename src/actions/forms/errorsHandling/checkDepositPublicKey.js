export const checkDepositPublicKey = ({depositPublicKey}) => {
    if(depositPublicKey.match(/^  *$/) !== null) return 'required'
    if(depositPublicKey.length !== 66 && depositPublicKey.length !== 130) return 'invalid_public_key'
    if (!/^[a-zA-Z0-9]*$/.test(depositPublicKey)) return 'invalid_public_key'
}



