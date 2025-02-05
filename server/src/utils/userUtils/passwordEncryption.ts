import bcrypt from "bcrypt";
import {IUser} from "../../types/user.types.js";

const SALT_ROUNDS = 10;

export const encryptPassword = async (password:string) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const validatePassword = async (password:string, user:IUser) => {
  const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      throw {
        status: 401, message: 'Invalid password'
      };
    }
    return user;
}


