var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import checkTokens from "../utils/tokens/checkTokens.js";
import User from "../models/userModel.js";
import { getTokens } from "../utils/tokens/getJwtToken.js";
import { AppError, formatResponse } from "../types/custom.types.js";
const giveNewTokens = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = yield checkTokens(req, res, process.env.JWT_REFRESH_SECRET);
        const user = yield User.findById(userId);
        if (!user) {
            throw new AppError("Invalid Token", 401);
        }
        const tokens = yield getTokens(userId);
        res.json(formatResponse(true, "New token generated successfully.", {
            user,
            tokens
        }));
    }
    catch (error) {
        console.log("error in validate token", error);
        res.status(error.statusCode || 500).json(formatResponse(false, error.message || "Server error during give new tokens"));
    }
});
export default {
    giveNewTokens
};
//# sourceMappingURL=tokenController.js.map