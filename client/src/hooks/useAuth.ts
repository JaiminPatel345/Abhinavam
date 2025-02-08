import {ILoginCredentials} from "@/types/user.types";
import {loginThunk} from "@redux/thunks/authThunk";
import {useDispatch, useSelector} from 'react-redux';
import {ThunkDispatch} from "redux-thunk";
import {clearNotification, showNotification} from "@redux/slice/notificationSlice";


const useAuth = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const userData = useSelector((state: any) => state.user);

  const loginUser = (credentials: ILoginCredentials) => {
    dispatch(clearNotification())

    if (userData && userData.token && userData.token.length > 0) {
      dispatch(
          showNotification({
            message: 'if you want to login with another account, please logout first',
            type: 'INFO',
            title: 'Already logged in'

          })
      )
      return;
    }

    return dispatch(loginThunk(credentials));
  }

  return {loginUser};

}

export default useAuth;