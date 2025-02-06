import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
const getJwtToken = (res, user) => {
    return jwt.sign({ userId: user._id, email: user.email, username: user.username }, JWT_SECRET);
};
export default getJwtToken;
//# sourceMappingURL=getJwtToken.js.map