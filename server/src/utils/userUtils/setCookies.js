import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  //Want to save it permanent
  // maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
};

export const clearCookies = (res) => {
  res.clearCookie('authToken', {
    ...COOKIE_OPTIONS,
    maxAge: 0
  });

}

const setCookies = (  res , user ) => {
   const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        // { expiresIn: '1y' }
      );

      // Set JWT in HTTP-only cookie
      res.cookie('authToken', token, COOKIE_OPTIONS);
}

export default setCookies;