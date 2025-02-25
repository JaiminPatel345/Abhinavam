import cloudinary from "cloudinary";
import "../configs/cloudinatyConfig.js";
import {AppError} from "../types/custom.types.js";

export const signUploadUserWidget = (userId:string ,mode:string) => {
  const apiSecrete = process.env.CLOUDINARY_SECRET_KEY;
  if(!apiSecrete){
    throw new AppError('No token found' , 500)
  }
  const timestamp =  Math.round((new Date).getTime()/1000);
  const signature = cloudinary.v2.utils.api_sign_request({
    timestamp,
    folder: `${mode}/user_${userId}`

  } ,apiSecrete );
   return { timestamp, signature , folder: `${mode}/user_${userId}` }
}
