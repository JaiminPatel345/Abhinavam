import {createAsyncThunk} from "@reduxjs/toolkit";
import {showNotification} from "@/redux/slice/notificationSlice";
import getSignature from "@/utils/userUtils/getSignature";
import {userApi} from "@/api/userApi";
import {ImagePickerResult} from "expo-image-picker/build/ImagePicker.types";
import {ICompleteProfilePayload} from "@/types/user.types";
import {ISignatureResponse} from "@/types/response.types";
import {makeFormDataForImageUpload} from "@/utils/comman";
import {IFetchUserPostsRequest} from "@/types/request.types";
import {IPost} from "@/types/posts.types";
import {RootState} from "@/types/redux.types";
import {getLikedPosts} from "@/utils/posts/getLikedPosts";

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
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
        const signatureData: ISignatureResponse = await getSignature('profile');

        // Create form data for upload
        const formData = makeFormDataForImageUpload([imageUri], signatureData)[0];

        const response = await userApi.uploadImageToCloudinary(formData);
        const result: CloudinaryUploadResponse = response.data;

        console.log('Upload result:', result);


        dispatch(showNotification({
          type: 'SUCCESS',
          title: 'Success',
          message: 'Profile image updated successfully',
        }));

        await userApi.uploadImageToDB({url:result.secure_url , public_id:result.public_id});

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

export const updateUserProfileThunk = createAsyncThunk(
    'users/update-profile',
    async (data: ICompleteProfilePayload, {dispatch, rejectWithValue}) => {
      try {
        const response = await userApi.updateUserProfile(data);
        console.log("Response data", response.data);

        dispatch(showNotification({
          type: 'SUCCESS',
          title: 'Profile Updated',
          message: 'Your profile has been updated successfully',
        }));

        return response.data.data;

      } catch (error: any) {
        console.error('Update error:', error.response || error);

        dispatch(showNotification({
          type: 'DANGER',
          title: 'Update Failed',
          message: error.message || 'Please try again later',
        }));

        return rejectWithValue(error.message);
      }
    }
);

export const fetchMyData = createAsyncThunk('users/', async (_, {rejectWithValue}) => {
  try {
    const response = await userApi.fetchMe();
    return response.data.data;
  } catch (error: any) {
    console.log('Fetch user error:', error.response || error);
    return rejectWithValue(error.message);
  }
})

