import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const encryptPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const validatePassword = async (password, user) => {
  const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      throw {
        status: 401, message: 'Invalid password'
      };
    }
    return user;
}


