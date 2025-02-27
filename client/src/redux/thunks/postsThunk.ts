import {createAsyncThunk} from "@reduxjs/toolkit";
import {
  ICreatePostForm,
  ICreatePostSubmit,
  IPost,
  IPostReactionType
} from "@/types/posts.types";
import {postAPI} from "@/api/postAPI";
import {showNotification} from "@redux/slice/notificationSlice";
import {setRedirectUrl} from "@redux/slice/userSlice";
import getSignature from "@/utils/userUtils/getSignature";
import {makeFormDataForImageUpload} from "@/utils/comman";
import {IAddReaction, IAllPostsFetch} from "@/types/request.types";
import {RootState} from "@/types/redux.types";
import {store} from "@redux/store";

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


export const fetchPostsThunk = createAsyncThunk(
  '/posts/fetchAllPost',
  async (credentials: IAllPostsFetch, {dispatch, rejectWithValue, getState}) => {
    try {
      const response = await postAPI.fetchAllPosts(credentials);
      const posts: IPost[] = response.data.data.posts;
      const state = getState() as RootState;
      const username = state.user.user?.username;
      console.log(posts)

      // Initialize empty object for liked posts
      const likedPosts: Record<string, IPostReactionType> = {};

      // Only process reactions if user is logged in
      if (username) {
        // Process each post to find user reactions
        posts.forEach((post: IPost) => {
          const reaction = post.reactions.find(
            reaction => reaction.user.username === username
          );

          if (reaction) {
            likedPosts[post._id] = reaction.type;
          }
        });
      }

      console.log("Liked array : " , likedPosts)

      return { posts, likedPosts };
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

export const addReactionThunk = createAsyncThunk('/posts/addReaction', async (credentials:IAddReaction, {dispatch, rejectWithValue}) => {
  try {
    const response = await postAPI.addReaction(credentials);
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

export const removeReactionThunk = createAsyncThunk('/posts/removeReaction', async (postId:string, {dispatch, rejectWithValue}) => {
  try {
    const response = await postAPI.removeReaction(postId);
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
