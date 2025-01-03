
export const generatePassword = () => {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits = "0123456789";
  const special = "@#$!%*";

  let password = "";
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length)); 
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length)); 
  password += special.charAt(Math.floor(Math.random() * special.length)); 
  password += digits.charAt(Math.floor(Math.random() * digits.length)); 

  for (let i = 4; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return password;
};