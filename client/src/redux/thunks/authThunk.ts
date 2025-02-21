import {createAsyncThunk} from "@reduxjs/toolkit";
import {ILoginCredentials, IRegisterUserRequest, IVerifyOtp} from "@/types/user.types";
import {authAPI} from "@/api/authApis";
import {showNotification} from "@redux/slice/notificationSlice";
import {IApiResponse} from "@/types/response.types";

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (credentials: ILoginCredentials, {dispatch, rejectWithValue}) => {
      try {
        const response = await authAPI.login(credentials);
        const data: IApiResponse = await response.data;

        if (!data.success) {
          throw new Error(data.message);
        }
        dispatch(
            showNotification({
              type: 'SUCCESS',
              title: 'Login Successful',
            })
        )
        return data.data;

      } catch (error: any) {
        console.log("Error at login :", error.response || error);
        console.log(error.response)
        dispatch(
            showNotification({
              type: 'DANGER',
              title: 'Login Failed',
              message: error.response.data.message || 'An unexpected error occurred.',
            }))
        return rejectWithValue(error.response.data || "An error occurred during login");
      }
    }
);

export const signupThunk = createAsyncThunk(
    "auth/register/init",
    async (credentials: IRegisterUserRequest, {dispatch, rejectWithValue}) => {
      try {
        const response = await authAPI.register(credentials);
        dispatch(
            showNotification({
              type: 'SUCCESS',
              title: 'OTP send successfully',
            })
        )
        return response.data.data;
      } catch (error: any) {
        console.log(error);
        console.log("error message : ", error.message)
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

export const verifyOtpThunk = createAsyncThunk(
    "auth/register/verify-otp",
    async (credentials: IVerifyOtp, {dispatch, rejectWithValue}) => {
      try {
        const response = await authAPI.verifyOtp(credentials);
        dispatch(
            showNotification({
              type: 'SUCCESS',
              title: 'OTP verified successfully',
              message: 'Fills other details to complete registration'
            })
        )
        return response.data.data;
      } catch (error: any) {
        console.log(error);
        console.log("error message : ", error.message)
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