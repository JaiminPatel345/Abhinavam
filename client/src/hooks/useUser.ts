import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/types/redux.types";
import {clearNotification} from "@redux/slice/notificationSlice";
import {
  fetchMyData,
  updateUserProfileThunk,
  uploadUserProfileThunk
} from "@redux/thunks/userThunk";
import {ImagePickerResult} from "expo-image-picker/build/ImagePicker.types";
import {ICompleteProfilePayload} from "@/types/user.types";
import {useEffect} from "react";
import {IFetchUserPostsRequest} from "@/types/request.types";

const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();

  const uploadUserAvatar = (imageResult: ImagePickerResult) => {
    dispatch(clearNotification());
    return dispatch(uploadUserProfileThunk(imageResult));
  };

  const updateUserProfile = (data: ICompleteProfilePayload) => {
    dispatch(clearNotification());
    return dispatch(updateUserProfileThunk(data));
  }

  return {uploadUserAvatar, updateUserProfile};
};

export const useUserDataManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {lastFetched, user} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const shouldFetchUser = () => {
      if (!user) return true;
      if (!lastFetched) return true;

      // ReFetch if data is older than 24 hours
      const twentyFourHours = 24 * 60 * 60 * 1000;
      return Date.now() - lastFetched > twentyFourHours;
    };

    if (shouldFetchUser()) {
      dispatch(fetchMyData());
    }
  }, []);
};

export default useUser;