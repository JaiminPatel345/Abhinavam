import {createSlice} from "@reduxjs/toolkit";
import {AuthState} from "@/types/user.types";
import {loginThunk, signupThunk, verifyOtpThunk} from "@redux/thunks/authThunk";


const initialState: AuthState = {
  user: null,
  accessToken: null,
  isLoading: false,
  redirectUrl: null
}

//TODO: work with token

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.redirectUrl = '/'
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
        })
        .addCase(loginThunk.fulfilled, (state, action) => {
          state.user = action.payload.user;
          state.accessToken = action.payload.tokens.accessToken;
          state.isLoading = false;
          state.redirectUrl = '/'
        })
        .addCase(loginThunk.rejected, (state, action: any) => {
          state.isLoading = false;
          if (action.payload.data?.isNeedVerifyOtpVerification) {
            console.log("redirect to verify otp")
            state.redirectUrl = '/auth/signup/VerifyOTP'
            state.user = action.payload.data.user;
          }

        })

        //signup stage1
        .addCase(signupThunk.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(signupThunk.fulfilled, (state, action) => {
          console.log("action.payload : ", action.payload)
          state.user = action.payload.user;
          state.isLoading = false;
          state.redirectUrl = '/auth/signup/VerifyOTP'

        })
        .addCase(signupThunk.rejected, (state, action) => {
          state.isLoading = false;
        })

        //signup stage 2 : verify otp
        .addCase(verifyOtpThunk.pending, (state) => {
              state.isLoading = true;
            }
        )
        .addCase(verifyOtpThunk.fulfilled, (state, action) => {
          state.user = action.payload.user;
          state.accessToken = action.payload.tokens.accessToken;
          state.isLoading = false;
          state.redirectUrl = '/auth/signup/AdditionalDetails'

        })
        .addCase(verifyOtpThunk.rejected, (state, action) => {
          state.isLoading = false;
        })
  },
})

export const {logout, setIsLoading} = userSlice.actions;
export default userSlice.reducer;