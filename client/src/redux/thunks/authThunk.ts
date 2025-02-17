import {createAsyncThunk} from "@reduxjs/toolkit";
import {ILoginCredentials, IRegisterUserRequest} from "@/types/user.types";
import {authAPI} from "@/api/auth";
import {showNotification} from "@redux/slice/notificationSlice";
import {setIsEmailSend} from "@redux/slice/registerSlice";

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (credentials: ILoginCredentials, {dispatch, rejectWithValue}) => {
      try {
        const response = await authAPI.login(credentials);
        dispatch(
            showNotification({
              type: 'SUCCESS',
              title: 'Login Successful',
            })
        )
        return response.data.data;
      } catch (error: any) {

        console.log(error);
        dispatch(
            showNotification({
              type: 'DANGER',
              title: 'Login Failed',
              message: error.response?.data?.message || 'An unexpected error occurred.',
            }))
        return rejectWithValue("An error occurred during login");
      }
    }
);

export const signupThunk = createAsyncThunk(
    "auth/register",
    async (credentials: IRegisterUserRequest, {dispatch, rejectWithValue}) => {
      try {
        const response = await authAPI.register(credentials);
        dispatch(
            showNotification({
              type: 'SUCCESS',
              title: 'OTP send successfully',
            })
        )
        console.log("response : " , response)
        console.log("response.data : " , response.data)
        dispatch(setIsEmailSend(true));
        return response.data.data;
      } catch (error: any) {
        console.log(error);
        console.log("error message : " , error.message)
        dispatch(
            showNotification({
              type: 'DANGER',
              title: 'Registration Failed',
              message: error.response?.data?.message || 'An unexpected error occurred.',
            }))
        return rejectWithValue("An error occurred during registration");
      }
    }
);