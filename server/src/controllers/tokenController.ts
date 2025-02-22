import checkTokens from "../utils/tokens/checkTokens.js";
import {Request, Response} from "express";
import User from "../models/userModel.js";
import {getTokens} from "../utils/tokens/getJwtToken.js";
import {AppError, formatResponse} from "../types/custom.types.js";



const giveNewTokens = async (req:Request , res:Response ) => {
  try {

    const userId:string | void = await checkTokens(req , res , process.env.JWT_REFRESH_SECRET as string)
    if(!userId){
      throw new AppError("Unauthorized need to login", 401)
    }
    const user = await User.findById(userId)
    if(!user){
      throw new AppError("Invalid Token", 401)
    }
    const tokens = await getTokens(userId)
    res.json(formatResponse(true , "New token generated successfully." , {
      user,
      tokens
    }))


  }catch (error: any) {
    console.log("error in validate token", error)
    res.status(error.statusCode || 500).json(formatResponse(false, error.message || "Server error during give new tokens"));
  }
}

export default {
  giveNewTokens
}

