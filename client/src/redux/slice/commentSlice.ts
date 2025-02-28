import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
  fetchCommentsThunk,
  addCommentThunk,
  likeCommentThunk,
  unlikeCommentThunk
} from "@redux/thunks/commentsThunk";
import { IComment } from "@/types/posts.types";
import {RootState} from "@/types/redux.types";

interface ICommentSliceInitState {
  isLoading: boolean;
  comments: Record<string, Record<string, IComment>>; // postId -> commentId -> comment
  likedComments: Record<string, boolean>; // commentId -> isLiked
}

const initialState: ICommentSliceInitState = {
  isLoading: false,
  comments: {},
  likedComments: {},
};

export const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    setCommentsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearComments: (state, action: PayloadAction<string>) => {
      // Clear comments for a specific post
      if (state.comments[action.payload]) {
        delete state.comments[action.payload];
      }
    },
    clearAllComments: (state) => {
      state.comments = {};
      state.likedComments = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchCommentsThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCommentsThunk.fulfilled, (state, action: PayloadAction<{
        comments: IComment[],
        likedComments: Record<string, boolean>,
        postId: string
      }>) => {
        state.isLoading = false;
        const { comments, likedComments, postId } = action.payload;

        // Initialize post comments if needed
        if (!state.comments[postId]) {
          state.comments[postId] = {};
        }

        // Add fetched comments to state
        comments.forEach(comment => {
          state.comments[postId][comment._id] = comment;
        });

        // Update liked comments
        state.likedComments = { ...state.likedComments, ...likedComments };
      })
      .addCase(fetchCommentsThunk.rejected, (state) => {
        state.isLoading = false;
      })

      // Add Comment
      .addCase(addCommentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCommentThunk.fulfilled, (state, action: PayloadAction<{
        comment: IComment,
        postId: string
      }>) => {
        state.isLoading = false;
        const { comment, postId } = action.payload;

        // Initialize post comments if needed
        if (!state.comments[postId]) {
          state.comments[postId] = {};
        }

        // Add new comment
        state.comments[postId][comment._id] = comment;
      })
      .addCase(addCommentThunk.rejected, (state) => {
        state.isLoading = false;
      })

      // Like Comment
      .addCase(likeCommentThunk.fulfilled, (state, action: PayloadAction<{
        commentId: string,
        userId: string
      }>) => {
        const { commentId, userId } = action.payload;

        // Update liked status
        state.likedComments[commentId] = true;

        // Update comment likes
        for (const postId in state.comments) {
          if (state.comments[postId][commentId]) {
            if (!state.comments[postId][commentId].likes.includes(userId)) {
              state.comments[postId][commentId].likes.push(userId);
            }
            break;
          }
        }
      })

      // Unlike Comment
      .addCase(unlikeCommentThunk.fulfilled, (state, action: PayloadAction<{
        commentId: string,
        userId: string
      }>) => {
        const { commentId, userId } = action.payload;

        // Update liked status
        state.likedComments[commentId] = false;

        // Update comment likes
        for (const postId in state.comments) {
          if (state.comments[postId][commentId]) {
            state.comments[postId][commentId].likes =
              state.comments[postId][commentId].likes.filter(id => id !== userId);
            break;
          }
        }
      });
  }
});

export const {
  setCommentsLoading,
  clearComments,
  clearAllComments
} = commentSlice.actions;

export default commentSlice.reducer;