import {userApi} from "@/api/userApi";

const getSignature = async () => {
  const signatureResponse = await userApi.getProfileSignature();
  return signatureResponse.data.data;
}

export default getSignature;