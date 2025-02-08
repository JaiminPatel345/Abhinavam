import {createAsyncThunk} from "@reduxjs/toolkit";
import {ILoginCredentials} from "@/types/user.types";
import {authAPI} from "@/api/auth";
import {showNotification} from "@redux/slice/notificationSlice";

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