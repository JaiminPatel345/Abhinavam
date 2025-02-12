import generateOtp from "./generateOtp.js";
import sendMail from "./sendMail.js";
import {setEmailAndOtp} from "../../redis/redisUtils.js";

const handleOtp = async (email:string) => {
  const generatedOtp = generateOtp();
    await Promise.all([
      sendMail(email, generatedOtp), // Assuming SMS functionality
      setEmailAndOtp(email, generatedOtp)
    ]);
}

export default handleOtp;