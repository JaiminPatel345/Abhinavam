import {clearNotification} from "@redux/slice/notificationSlice";
import {useDispatch} from "react-redux";
import {createPostThunk} from "@redux/thunks/postsThunk";
import {ThunkDispatch} from "redux-thunk";
import {ICreatePostForm} from "@/types/posts.types";

const usePost = () => {
    const dispatch = useDispatch<ThunkDispatch<any,any,any>>();

  const createPost = (credentials:ICreatePostForm , selectedImages:string[]) => {
    dispatch(clearNotification());
    return dispatch(createPostThunk({credentials, selectedImages}));
  }

  return {createPost};
}

export default usePost;