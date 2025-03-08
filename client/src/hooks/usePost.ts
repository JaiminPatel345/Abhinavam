import {clearNotification} from "@/redux/slice/notificationSlice";
import {useDispatch} from "react-redux";
import {
  addReactionThunk,
  createPostThunk,
  fetchPostsThunk,
  removeReactionThunk
} from "@/redux/thunks/postsThunk";
import {ThunkDispatch} from "redux-thunk";
import {ICreatePostForm} from "@/types/posts.types";
import {IAddReaction, IFetchPostsRequest} from "@/types/request.types";

const usePost = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const createPost = (credentials: ICreatePostForm, selectedImages: string[]) => {
    dispatch(clearNotification());
    return dispatch(createPostThunk({credentials, selectedImages}));
  }

  const fetchPosts = (credentials: IFetchPostsRequest) => {
    dispatch(clearNotification());
    return dispatch(fetchPostsThunk(credentials));
  }

  const addReaction = (credentials: IAddReaction) => {
    dispatch(clearNotification());
    return dispatch(addReactionThunk(credentials));
  }
  const removeReaction = (postId: string) => {
    dispatch(clearNotification());
    return dispatch(removeReactionThunk(postId));
  }

  return {createPost, fetchPosts, addReaction, removeReaction};
}

export default usePost;