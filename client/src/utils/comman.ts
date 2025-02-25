import {ISignatureResponse} from "@/types/response.types";

export const makeFormDataForImageUpload = (images: string[], signatureData: ISignatureResponse) => {
  const allImageFormData:FormData[] = []
  images.map((image, index) => {
    let formData = new FormData();
    formData.append('file', {
      uri: image,
      type: 'image/jpeg',
      name: `post-${index}.jpg`,
    } as any);
    formData.append('api_key', process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || 'abc');
    formData.append('cloud_name', process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'abc');
    formData.append('folder', signatureData.folder);
    formData.append('signature', signatureData.signature);
    formData.append('timestamp', signatureData.timestamp.toString());

    allImageFormData.push(formData)

  })

  return allImageFormData
}