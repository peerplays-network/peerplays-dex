export const checkPassword = ({password, passwordCheck}) => {
  if (!password) return false;
  if (/\s/g.test(password)) return 'passwordNoBlank';
  if(password) {
    if (password.length < 12) return 'passwordLength';
  }
};

export const checkConfirmPassword = ({password, passwordCheck}) => {
  if (!passwordCheck) return false;
  if (passwordCheck && !password) return 'needPassword';
  if (password !== passwordCheck) return 'passwordsNotMatch';
};