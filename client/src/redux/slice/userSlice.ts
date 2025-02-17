import {createSlice} from "@reduxjs/toolkit";
import {IUser} from "@/types/user.types";
import {loginThunk, signupThunk} from "@redux/thunks/authThunk";

interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
        .addCase(loginThunk.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(loginThunk.fulfilled, (state, action) => {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isLoading = false;
        })
        .addCase(loginThunk.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        })

    //signup
        .addCase(signupThunk.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(signupThunk.fulfilled, (state, action) => {
          state.isLoading = false;
        })
        .addCase(signupThunk.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        })

  },
})

export const {logout , setIsLoading} = userSlice.actions;
export default userSlice.reducer;