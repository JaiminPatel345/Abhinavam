import {clearNotification} from "@/redux/slice/notificationSlice";
import {useDispatch} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {
  addCommentThunk,
  fetchCommentsThunk,
  fetchRepliesThunk,
  likeCommentThunk,
  unlikeCommentThunk
} from "@/redux/thunks/commentsThunk";
import {
  IAddCommentRequest,
  IFetchCommentsRequest,
  IFetchReplyRequest
} from "@/types/request.types";

const useComments = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const addComment = (commentData: IAddCommentRequest) => {
    dispatch(clearNotification());
    return dispatch(addCommentThunk(commentData));
  };

  const fetchComments = (request: IFetchCommentsRequest) => {
    dispatch(clearNotification());
    return dispatch(fetchCommentsThunk(request));
  };

  const likeComment = (commentId: string, userId: string) => {
    dispatch(clearNotification());
    return dispatch(likeCommentThunk({commentId, userId}));
  };

  const unlikeComment = (commentId: string, userId: string) => {
    dispatch(clearNotification());
    return dispatch(unlikeCommentThunk({commentId, userId}));
  };

  const fetchReplies = (request: IFetchReplyRequest) => {
    dispatch(clearNotification());
    return dispatch(fetchRepliesThunk(request));
  }

  return {
    addComment,
    fetchComments,
    likeComment,
    unlikeComment,
    fetchReplies,

  };
};

export default useComments;