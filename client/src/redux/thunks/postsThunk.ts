import {createAsyncThunk} from "@reduxjs/toolkit";
import {ICreatePostForm, ICreatePostSubmit} from "@/types/posts.types";
import {postAPI} from "@/api/postAPI";
import {showNotification} from "@redux/slice/notificationSlice";
import {setRedirectUrl} from "@redux/slice/userSlice";
import getSignature from "@/utils/userUtils/getSignature";
import {makeFormDataForImageUpload} from "@/utils/comman";

export const createPostThunk = createAsyncThunk('/posts/', async ({
                                                                    credentials,
                                                                    selectedImages
                                                                  }: {
  credentials: ICreatePostForm;
  selectedImages: string[]
}, {
                                                                    dispatch,
                                                                    rejectWithValue
                                                                  }) => {
  try {

    //get Signature
    const signature = await getSignature('posts');

    //make form data
    const formData = makeFormDataForImageUpload(selectedImages, signature); //returns array of form data

    const cloudinaryResponses = await postAPI.uploadImagesToCloudinary(formData);
    console.log("cloudinaryResponse", cloudinaryResponses[0].data);

    const submitForm: ICreatePostSubmit = {
      ...credentials,
      media: cloudinaryResponses.map((response: any) => {
        return {
          url: response.data.secure_url,
          public_id: response.data.public_id
        }
      })
    }

    const response = await postAPI.create(submitForm);
    dispatch(showNotification({
      type: 'SUCCESS',
      title: 'Post Created Successfully'
    }))
    dispatch(setRedirectUrl('/'));
    return response.data.data;
  } catch (error: any) {
    console.log("Error at create post :", error.response || error);
    dispatch(showNotification({
      type: 'DANGER',
      title: 'Cannot create post',
      message: error.response?.data?.message || error.response?.message || 'An unexpected error occurred.'
    }))
    return rejectWithValue(error?.response?.data || "An error occurred during create post");
  }
})
