import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/types/redux.types";
import { clearNotification } from "@redux/slice/notificationSlice";
import { uploadUserProfileThunk } from "@redux/thunks/userThunk";
import {ImagePickerResult} from "expo-image-picker/build/ImagePicker.types";

const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.user);

  const uploadUserProfile = async (imageResult: ImagePickerResult) => {
    dispatch(clearNotification());
    return dispatch(uploadUserProfileThunk(imageResult));
  };

  return { uploadUserProfile, userData };
};

export default useUser;