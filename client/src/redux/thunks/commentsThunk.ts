import {createAsyncThunk} from "@reduxjs/toolkit";
import {commentAPI} from "@/api/commentsApi";
import {showNotification} from "@/redux/slice/notificationSlice";
import {IComment} from "@/types/posts.types";
import {
  IAddCommentRequest,
  IFetchCommentsRequest,
  IFetchReplyRequest
} from "@/types/request.types";
import {RootState} from "@/types/redux.types";

export const fetchCommentsThunk = createAsyncThunk(
    '/comments/fetchComments',
    async (request: IFetchCommentsRequest, {
      dispatch,
      rejectWithValue,
      getState
    }) => {
      try {
        const response = await commentAPI.fetchComments(request);
        const comments: IComment[] = response.data.data.comments;
        const state = getState() as RootState;
        const userId = state.user.user?._id;

        // Initialize object to track liked comments
        const likedComments: Record<string, boolean> = {};

        // Only process likes if user is logged in
        if (userId) {
          // Process each comment to find user likes
          comments.forEach((comment: IComment) => {
            if (comment.likes.includes(userId)) {
              likedComments[comment._id] = true;
            }
          });
        }

        return {comments, likedComments, postId: request.postId};
      } catch (error: any) {
        console.log("Error fetching comments:", error.response || error);
        dispatch(showNotification({
          type: 'DANGER',
          title: 'Cannot fetch comments',
          message: error.response?.data?.message || error.response?.message || 'An unexpected error occurred.'
        }));
        return rejectWithValue(error?.response?.data || "An error occurred while fetching comments");
      }
    }
);

export const addCommentThunk = createAsyncThunk(
    '/comments/addComment',
    async (commentData: IAddCommentRequest, {
      dispatch,
      rejectWithValue,
    }) => {
      try {
        const response = await commentAPI.addComment(commentData);
        const comment: IComment = response.data.data;

        return {comment, postId: commentData.postId};
      } catch (error: any) {
        console.log("Error adding comment:", error.response || error);
        dispatch(showNotification({
          type: 'DANGER',
          title: 'Cannot add comment',
          message: error.response?.data?.message || error.response?.message || 'An unexpected error occurred.'
        }));
        return rejectWithValue(error?.response?.data || "An error occurred while adding comment");
      }
    }
);

export const likeCommentThunk = createAsyncThunk(
    '/comments/likeComment',
    async ({commentId, userId}: { commentId: string, userId: string }, {
      dispatch,
      rejectWithValue,
    }) => {
      try {

        if (!userId) {
          throw new Error("User not found");
        }
        const response = await commentAPI.likeComment(commentId);

        return {commentId, userId};
      } catch (error: any) {
        console.log("Error liking comment:", error.response || error);
        dispatch(showNotification({
          type: 'DANGER',
          title: 'Cannot like comment',
          message: error.response?.data?.message || error.response?.message || 'An unexpected error occurred.'
        }));
        return rejectWithValue(error?.response?.data || error.message || "An error occurred while liking comment");
      }
    }
);

export const unlikeCommentThunk = createAsyncThunk(
    '/comments/unlikeComment',
    async ({commentId, userId}: { commentId: string, userId: string }, {
      dispatch,
      rejectWithValue,
    }) => {
      try {
        if (!userId) {
          throw new Error("User not found");
        }
        const response = await commentAPI.unlikeComment(commentId);


        return {commentId, userId};
      } catch (error: any) {
        console.log("Error unliking comment:", error.response || error);
        dispatch(showNotification({
          type: 'DANGER',
          title: 'Cannot unlike comment',
          message: error.response?.data?.message || error.message || error.response?.message || 'An unexpected error occurred.'
        }));
        return rejectWithValue(error?.response?.data || "An error occurred while unliking comment");
      }
    }
);

export const fetchRepliesThunk = createAsyncThunk(
    '/comments/fetchReplies',
    async (request: IFetchReplyRequest, {
      dispatch,
      rejectWithValue,
    }) => {
      try {
        const response = await commentAPI.fetchReplies(request);
        const replies: IComment[] = response.data.data.replies;
        const userId:string = response.data.data.userId;

        let likedReplies: Record<string, boolean> = {};
        if (userId) {
          replies.forEach((reply: IComment) => {
            if (reply.likes.includes(userId)) {
              likedReplies[reply._id] = true;
            }
          });
        }

        return {replies, commentId:request.commentId , likedReplies};
      } catch (error: any) {
        console.log("Error fetching replies:", error.response || error);
        dispatch(showNotification({
          type: 'DANGER',
          title: 'Cannot fetch replies',
          message: error.response?.data?.message || error.response?.message || 'An unexpected error occurred.'
        }));
        return rejectWithValue(error?.response?.data || "An error occurred while fetching replies");
      }
    }
);