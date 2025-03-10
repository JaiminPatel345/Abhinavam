import {createAsyncThunk} from "@reduxjs/toolkit";
import {
  ILoginCredentials,
  IRegisterUserRequest,
  IUser,
  IVerifyOtp
} from "@/types/user.types";
import {authAPI} from "@/api/authApis";
import {showNotification} from "@/redux/slice/notificationSlice";
import {IApiResponse} from "@/types/response.types";
import TokenService from "@/utils/tokens/TokenService";

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
        console.log("response : ", response);
        console.log("following : ", data.data?.user.following)
        await TokenService.storeTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
        return data.data;

      } catch (error: any) {
        console.log("Error at login :", error.response || error);
        dispatch(
            showNotification({
              type: 'DANGER',
              title: 'Login Failed',
              message: error.response.data.message || 'An unexpected error occurred.',
            }))
        return rejectWithValue(error?.response?.data || "An error occurred during login");
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
        await TokenService.storeTokens(response.data.data.tokens.accessToken, response.data.data.tokens.refreshToken);

        return response.data.data;
      } catch (error: any) {
        console.log(error);
        console.log("error at verify otp message : ", error.message)
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

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, {dispatch, rejectWithValue}) => {
      try {
        const response = await authAPI.logout();
        await TokenService.removeTokens();
        dispatch(
            showNotification({
              type: 'SUCCESS',
              title: 'Logout Successful',
            })
        )
        return response.data;
      } catch (error: any) {
        console.log(error);

        return rejectWithValue("An error occurred during logout");
      }
    }
);