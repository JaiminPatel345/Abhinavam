var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { client } from "../../redis/redis.js";
import { AppError } from "../errors/helpers.js";
import { formatResponse } from "../formatResponse.js";
import checkTokens from "../tokens/checkTokens.js";
export const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uuid = yield checkTokens(req, res, process.env.JWT_ACCESS_SECRET);
        //get from redis
        const userId = yield client.get(uuid);
        if (!userId) {
            throw new AppError('Invalid token', 401);
        }
        //TODO:Remove in production
        console.log(userId);
        req.userId = userId;
        next();
    }
    catch (error) {
        //TODO:Remove in production
        console.log("error in validate token", error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || "Server error during authentication"));
    }
});
//# sourceMappingURL=IsUserLoggedIn.js.map