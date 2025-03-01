import {
  IAddCommentRequest,
  IFetchCommentsRequest,
  IFetchReplyRequest
} from "@/types/request.types";
import axiosInstance from "@/api/axiosClient";

export const commentAPI = {
  fetchComments: (request: IFetchCommentsRequest) => {
    return axiosInstance.get(`/posts/${request.postId}/comments`, {
      params: {
        limit: request.limit,
        page: request.page,
        parentComment: request.parentComment
      }
    });
  },

  addComment: (commentData: IAddCommentRequest) => {
    return axiosInstance.post(`/posts/${commentData.postId}/comments`, {
      content: commentData.content,
      parentCommentId: commentData.parentComment
    });
  },

  likeComment: (commentId: string) => {
    return axiosInstance.post(`/comments/like/${commentId}`);
  },

  unlikeComment: (commentId: string) => {
    return axiosInstance.delete(`/comments/like/${commentId}`);
  },

  fetchReplies: (request: IFetchReplyRequest) => {
    return axiosInstance.get(`/comments/${request.commentId}/replies`, {
      params: {
        limit: request.limit,
        page: request.page
      }
    });
  }
};