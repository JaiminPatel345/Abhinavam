import {ILoginCredentials, IRegisterUserRequest, IVerifyOtp} from "@/types/user.types";
import {loginThunk, logoutThunk, signupThunk, verifyOtpThunk} from "@/redux/thunks/authThunk";
import {useDispatch, useSelector} from 'react-redux';
import {ThunkDispatch} from "redux-thunk";
import {clearNotification, showNotification} from "@/redux/slice/notificationSlice";
import {useRouter} from "expo-router";
import {setIsLoading} from "@/redux/slice/userSlice";


const useAuth = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const userData = useSelector((state: any) => state.user);
  const Router = useRouter()

  const loginUser = (credentials: ILoginCredentials) => {
    dispatch(clearNotification())

    if (userData && userData.accessToken && userData.accessToken.length > 0) {
      dispatch(
          showNotification({
            message: 'if you want to login with another account, please logout first',
            type: 'INFO',
            title: 'Already logged in'

          })
      )
      Router.replace('/')
      return;
    }

    return dispatch(loginThunk(credentials));
  }

  const registerUser = (credentials: IRegisterUserRequest) => {
    dispatch(clearNotification())

    if (userData && userData.accessToken && userData.accessToken.length > 0) {
      dispatch(
          showNotification({
            message: 'if you want to register with another account, please logout first',
            type: 'INFO',
            title: 'Already logged in'
          })
      )
      dispatch(setIsLoading(false))
      Router.replace('/')
      return;
    }
    return dispatch(signupThunk(credentials));
  }

  const verifyOtp = (credentials:IVerifyOtp) => {
    dispatch(clearNotification())

    if (userData?.accessToken?.length > 0) {
      dispatch(
          showNotification({
            message: 'if you want to register with another account, please logout first',
            type: 'INFO',
            title: 'Already logged in'
          })
      )
      dispatch(setIsLoading(false))
      Router.replace('/')
      return;
    }

    return dispatch(verifyOtpThunk(credentials));
  }

  const logoutUser = () => {
    dispatch(clearNotification())
    return dispatch(logoutThunk())
  }

  return {loginUser, registerUser, verifyOtp , logoutUser};

}

export default useAuth;