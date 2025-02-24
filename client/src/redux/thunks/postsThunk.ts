import {createAsyncThunk} from "@reduxjs/toolkit";
import {CreatePostBody} from "@/types/posts.types";
import {postAPI} from "@/api/postAPI";
import {showNotification} from "@redux/slice/notificationSlice";

export const createPostThunk = createAsyncThunk('/posts/', async (credentials: CreatePostBody, {
  dispatch,
  rejectWithValue
}) => {
  try {
    const response = await postAPI.create(credentials);
    dispatch(showNotification({
      type: 'SUCCESS',
      title: 'Post Created Successfully'
    }))
    return response.data.data;
  } catch (error: any) {
    console.log("Error at create post :", error.response || error);
    dispatch(showNotification({
      type: 'DANGER',
      title: 'Create Post Failed',
      message: error.response.data.message || 'An unexpected error occurred.'
    }))
    return rejectWithValue(error?.response?.data || "An error occurred during create post");
  }
})