import {createAsyncThunk} from "@reduxjs/toolkit";
import {showNotification} from "@redux/slice/notificationSlice";
import getSignature from "@/utils/userUtils/getSignature";
import {userApi} from "@/api/userApi";
import {ImagePickerResult} from "expo-image-picker/build/ImagePicker.types";

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

interface SignatureResponse {
  signature: string;
  timestamp: number;
  public_id: string;
}

export const uploadUserProfileThunk = createAsyncThunk(
    'users/upload-profile',
    async (imageResult: ImagePickerResult, {dispatch, rejectWithValue}) => {
      try {
        if (!imageResult.assets?.[0]?.uri) {
          throw new Error('No image selected');
        }

        const imageUri = imageResult.assets[0].uri;

        // Get upload signature from backend
        const signatureData: SignatureResponse = await getSignature();
        console.log("get signature ",signatureData)

        // Create form data for upload
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profile-image.jpg',
        } as any);

        // Add Cloudinary parameters
        formData.append('api_key', process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY || 'abc');
        formData.append('cloud_name', process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'abc');
        formData.append('folder', 'profile');
        formData.append('public_id', signatureData.public_id);
        formData.append('signature', signatureData.signature);
        formData.append('timestamp', signatureData.timestamp.toString());

        console.log("Full form : " ,formData)

        console.log("start to upload at cloudinary")
        const response = await userApi.uploadImageToCloudinary(formData);
        console.log("Response :",response)

        const result: CloudinaryUploadResponse = response.data;
        console.log("Result", result);

        dispatch(showNotification({
          type: 'SUCCESS',
          title: 'Success',
          message: 'Profile image updated successfully',
        }));

        return result;

      } catch (error: any) {
        console.error('Upload error:', error.response || error);

        dispatch(showNotification({
          type: 'DANGER',
          title: 'Upload Failed',
          message: error.message || 'Please try again later',
        }));

        return rejectWithValue(error.message);
      }
    }
);
