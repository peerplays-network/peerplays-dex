export const checkDepositPublicKey = ({depositPublicKey}) => {
    if(depositPublicKey.match(/^  *$/) !== null) return 'required'
    if(depositPublicKey.length < 66) return 'invalidKey'
}



