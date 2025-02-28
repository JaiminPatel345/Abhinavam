import { clearNotification } from "@redux/slice/notificationSlice";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import {
  addCommentThunk,
  fetchCommentsThunk,
  likeCommentThunk,
  unlikeCommentThunk
} from "@redux/thunks/commentsThunk";
import { IAddCommentRequest, IFetchCommentsRequest } from "@/types/request.types";

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

  const likeComment = (commentId:string , userId:string) => {
    dispatch(clearNotification());
    return dispatch(likeCommentThunk({commentId, userId}));
  };

  const unlikeComment = (commentId:string , userId:string) => {
    dispatch(clearNotification());
    return dispatch(unlikeCommentThunk({commentId, userId}));
  };

  return {
    addComment,
    fetchComments,
    likeComment,
    unlikeComment
  };
};

export default useComments;