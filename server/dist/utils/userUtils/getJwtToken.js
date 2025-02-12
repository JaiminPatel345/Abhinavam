import jwt from 'jsonwebtoken';
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
export const setCookies = (user) => {
    const token = generateToken(user);
    return token;
};
//# sourceMappingURL=getJwtToken.js.map