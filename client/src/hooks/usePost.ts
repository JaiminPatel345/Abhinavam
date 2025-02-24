import {CreatePostBody} from "@/types/posts.types";
import {clearNotification} from "@redux/slice/notificationSlice";
import {useDispatch} from "react-redux";
import {createPostThunk} from "@redux/thunks/postsThunk";
import {ThunkDispatch} from "redux-thunk";

const usePost = () => {
    const dispatch = useDispatch<ThunkDispatch<any,any,any>>();

  const createPost = (credentials:CreatePostBody) => {
    dispatch(clearNotification());
    return dispatch(createPostThunk(credentials));
  }

  return {createPost};
}

export default usePost;