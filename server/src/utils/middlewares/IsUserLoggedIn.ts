import {IMiddleware} from "../../types/common.types.js";
import {AppError, formatResponse} from "../../types/custom.types.js";
import checkTokens from "../tokens/checkTokens.js";

export const verifyToken: IMiddleware['verifyToken'] = async (req, res, next) => {
  try {

    //TODO:use when using redis
    // const uuid = await checkTokens(req, res, process.env.JWT_ACCESS_SECRET as string)
    // //get from redis
    // const userId = await client.get(uuid)


    //get from redis
    const userId = await checkTokens(req, res, process.env.JWT_ACCESS_SECRET as string)

    if (!userId) {
      throw new AppError('Invalid token , Unauthorized user', 401)
    }

    req.userId = userId;
    next();

  } catch (error: any) {

    //TODO:Remove in production
    console.log("error in validate token", error)
    res.status(error.statusCode || 500).json(formatResponse(false, error.message || "Server error during authentication"));

  }
}