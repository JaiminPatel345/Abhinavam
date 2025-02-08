import {ILoginCredentials} from "@/types/user.types";
import {loginThunk} from "@redux/thunks/authThunk";
import {useDispatch} from 'react-redux';
import {ThunkDispatch} from "redux-thunk";


const useAuth = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const loginUser = (credentials: ILoginCredentials) => {
    return dispatch(loginThunk(credentials));
  }

  return { loginUser };

}

export default useAuth;