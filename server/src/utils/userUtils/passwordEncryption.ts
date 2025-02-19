import bcrypt from "bcrypt";
import {IUser} from "../../types/user.types.js";
import {AppError} from "../../types/custom.types.js";

const SALT_ROUNDS = 10;

export const encryptPassword = async (password:string) => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const validatePassword = async (password:string, user:IUser , isEmail:boolean) => {
  const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      throw new AppError(`Invalid ${isEmail ? 'Email' : 'Username'} or Password` , 401);
    }
    return user;
}


