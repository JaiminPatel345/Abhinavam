var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bearerHeader = req.headers.authorization;
        if (!bearerHeader) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = bearerHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }
            req.user = decoded;
            next();
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error during authentication" });
    }
});
//# sourceMappingURL=IsUserLoggedIn.js.map