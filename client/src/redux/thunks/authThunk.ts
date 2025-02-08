// redux/thunks/authThunk.ts
import {AsyncThunk, createAsyncThunk} from "@reduxjs/toolkit";
import { ILoginCredentials } from "@/types/user.types";
import { authAPI } from "@/api/auth";

export const loginThunk  = createAsyncThunk(
  "auth/login",
  async (credentials: ILoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      console.log('response', response.data.data);
      return response.data.data;
    } catch (error: any) {
      //TODO: Flash error message
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      }
      // Otherwise return generic error message
      console.log(error);
      return rejectWithValue("An error occurred during login");
    }
  }
);