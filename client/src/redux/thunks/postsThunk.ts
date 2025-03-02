import {createAsyncThunk} from "@reduxjs/toolkit";
import {ICreatePostForm, ICreatePostSubmit, IPost} from "@/types/posts.types";
import {postsApi} from "@/api/postsApi";
import {showNotification} from "@redux/slice/notificationSlice";
import {setRedirectUrl} from "@redux/slice/userSlice";
import getSignature from "@/utils/userUtils/getSignature";
import {makeFormDataForImageUpload} from "@/utils/comman";
import {IAddReaction, IAllPostsFetch} from "@/types/request.types";
import {RootState} from "@/types/redux.types";
import {getLikedPosts} from "@/utils/posts/getLikedPosts";

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

    if (selectedImages.length > 0) {
      //get Signature
      const signature = await getSignature('posts');

      //make form data
      const formData = makeFormDataForImageUpload(selectedImages, signature); //returns array of form data

      const cloudinaryResponses = await postsApi.uploadImagesToCloudinary(formData);
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

      const response = await postsApi.create(submitForm);
      dispatch(showNotification({
        type: 'SUCCESS',
        title: 'Post Created Successfully'
      }))
      dispatch(setRedirectUrl('/'));
      return response.data.data;

    } else {

      const response = await postsApi.create(credentials);
      dispatch(showNotification({
        type: 'SUCCESS',
        title: 'Post Created Successfully'
      }))
      dispatch(setRedirectUrl('/'));
      return response.data.data;
    }


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


export const fetchPostsThunk = createAsyncThunk(
    '/posts/fetchAllPost',
    async (credentials: IAllPostsFetch, {
      dispatch,
      rejectWithValue,
      getState
    }) => {
      try {
        let response;
        if (credentials.userId) {
          response = await postsApi.fetchUserPosts(credentials);
        } else {
          response = await postsApi.fetchAllPosts(credentials);
        }
        const posts = response.data.data.posts as IPost[];
        if(posts.length === 0){
          return rejectWithValue("No posts found");
        }
        const state = getState() as RootState;
        const likedPosts = getLikedPosts(posts, state.user.user?.username || '');

        return {posts, likedPosts};
      } catch (error: any) {
        console.log("Error at fetch posts:", error.response || error);
        dispatch(showNotification({
          type: 'DANGER',
          title: 'Cannot fetch posts',
          message: error.response?.data?.message || error.response?.message || 'An unexpected error occurred.'
        }));
        return rejectWithValue(error?.response?.data || "An error occurred during fetch posts");
      }
    }
);

export const addReactionThunk = createAsyncThunk('/posts/addReaction', async (credentials: IAddReaction, {
  dispatch,
  rejectWithValue
}) => {
  try {
    const response = await postsApi.addReaction(credentials);
    return response.data.data;
  } catch (error: any) {
    console.log("Error at add reaction :", error.response || error);
    dispatch(showNotification({
      type: 'DANGER',
      title: 'Cannot add reaction',
      message: error.response?.data?.message || error.response?.message || 'An unexpected error occurred.'
    }))
    return rejectWithValue(error?.response?.data || "An error occurred during add reaction");
  }
})

export const removeReactionThunk = createAsyncThunk('/posts/removeReaction', async (postId: string, {
  dispatch,
  rejectWithValue
}) => {
  try {
    const response = await postsApi.removeReaction(postId);
    return response.data.data;
  } catch (error: any) {
    console.log("Error at remove reaction :", error.response || error);
    dispatch(showNotification({
      type: 'DANGER',
      title: 'Cannot remove reaction',
      message: error.response?.data?.message || error.response?.message || 'An unexpected error occurred.'
    }))
    return rejectWithValue(error?.response?.data || "An error occurred during remove reaction");
  }
})
