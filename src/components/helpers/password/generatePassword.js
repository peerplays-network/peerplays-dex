export const generatePassword = () => {
    let password = "";
    const characterList =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const characterListLength = characterList.length;
    for (let i = 0; i < 52; i++) {
        const characterIndex = Math.round(Math.random() * characterListLength);
        password += characterList.charAt(characterIndex);
    }
    return password;
}