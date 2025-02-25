import {userApi} from "@/api/userApi";
import {ISignatureResponse} from "@/types/response.types";

const getSignature: (mode:string) => Promise<ISignatureResponse>

= async (mode) => {
  const signatureResponse = await userApi.getProfileSignature(mode);
  return signatureResponse.data.data;
}

export default getSignature;