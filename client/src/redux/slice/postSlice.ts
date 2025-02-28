import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createPostThunk, fetchPostsThunk} from "@redux/thunks/postsThunk";
import {
  IOwner,
  IPost,
  IPostReactionType,
  IPostSliceInitState,
  IReaction
} from "@/types/posts.types";


const initialState: IPostSliceInitState = {
  isLoading: false,
  posts: null,
  likedPosts: {},
  page: 1,
  limit: 2,

}


export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    likeAPost: (state, action: PayloadAction<{
      postId: string,
      type: IPostReactionType,
      user: IOwner,

    }>) => {
      state.likedPosts[action.payload.postId] = action.payload.type;
      const myReaction: IReaction = {
        user: action.payload.user,
        type: action.payload.type,
      }
      if (state.posts) {
        if (state.posts[action.payload.postId].reactions.length === 0) {
          state.posts[action.payload.postId].reactions = [myReaction];
          return
        }
        state.posts[action.payload.postId].reactions.filter(reaction => reaction.user.username === action.payload.user.username);

        //TODO: Improve performance
        state.posts[action.payload.postId].reactions =
            state.posts[action.payload.postId].reactions.map(reaction => {
              if (reaction.user.username === action.payload.user.username) {
                return myReaction;
              } else {
                return reaction;
              }
            })

      }
    },
    unlikeAPost: (state, action: PayloadAction<{
      postId: string,
    }>) => {
      delete state.likedPosts[action.payload.postId];
    },
    clearAllPosts: (state) => {
      return {
        ...state,
        posts: null,
        likedPosts: {},
        page: 1,
        limit: 10,

      }
    },
    updateToNextPage: (state) => {
      state.page = state.page + 1;

    }

  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder

        //Fetch Posts
        .addCase(fetchPostsThunk.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(fetchPostsThunk.fulfilled, (state, action: PayloadAction<{
          posts: IPost[],
          likedPosts: Record<string, IPostReactionType>
        }>) => {
          state.isLoading = false;
          if (state.posts === null) {
            state.posts = {};
          }

          // Add new posts to the map
          action.payload.posts.forEach((post) => {
            state.posts![post._id] = post;
          })

          state.likedPosts = {...state.likedPosts, ...action.payload.likedPosts};

        })
        .addCase(fetchPostsThunk.rejected, (state, action) => {
          state.isLoading = false;
        })

        //Create new Post
        .addCase(createPostThunk.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(createPostThunk.fulfilled, (state, action) => {
          state.isLoading = false;
        })
        .addCase(createPostThunk.rejected, (state, action) => {
          state.isLoading = false;
        })
  }

})

export const {
  setIsLoading,
  likeAPost,
  unlikeAPost,
  clearAllPosts,
  updateToNextPage
} = postSlice.actions;
export default postSlice.reducer;