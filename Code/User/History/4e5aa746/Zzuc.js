const randomStr = (prfix) => {
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 3; i++) {
    prfix += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return prfix;
};

export const randomString = randomStr('');