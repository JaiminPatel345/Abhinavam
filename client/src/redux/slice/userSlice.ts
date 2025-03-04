import {createSlice} from "@reduxjs/toolkit";
import {AuthState} from "@/types/user.types";
import {
  loginThunk,
  logoutThunk,
  signupThunk,
  verifyOtpThunk
} from "@/redux/thunks/authThunk";
import {
  fetchMyData,
  updateUserProfileThunk,
  uploadUserProfileThunk
} from "@/redux/thunks/userThunk";


const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  redirectUrl: null,
  isImageUploading: false,
  lastFetched: 0,

}


export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setIsImageUploading: (state, action) => {
      state.isImageUploading = action.payload;
    },
    setRedirectUrl: (state, action) => {
      state.redirectUrl = action.payload;
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
          state.isLoggedIn = !!action.payload.tokens.accessToken;
          state.isLoading = false;
          state.redirectUrl = '/';
          state.lastFetched = Date.now();

        })
        .addCase(loginThunk.rejected, (state, action: any) => {
          state.isLoading = false;
          if (action.payload.data?.isNeedVerifyOtpVerification) {
            state.redirectUrl = '/auth/signup/VerifyOTP'
            state.user = action.payload.data.user;
            state.isLoading = false;
          }

        })

        //signup stage1
        .addCase(signupThunk.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(signupThunk.fulfilled, (state, action) => {
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
              state.lastFetched = Date.now();

            }
        )
        .addCase(verifyOtpThunk.fulfilled, (state, action) => {
          state.user = action.payload.user;
          state.isLoggedIn = !!action.payload.tokens.accessToken;
          state.isLoading = false;
          state.redirectUrl = '/auth/signup/AdditionalDetails'

        })
        .addCase(verifyOtpThunk.rejected, (state, action) => {
          state.isLoading = false;
          state.isLoggedIn = false;
        })

        //get cloudinary signature
        .addCase(uploadUserProfileThunk.pending, (state) => {
          state.isImageUploading = true;
        })
        .addCase(uploadUserProfileThunk.fulfilled, (state, action) => {
          state.isImageUploading = false;
          if (!state.user) return;
          console.log(action.payload.secure_url)
          state.user.avatar = {
            url: action.payload.secure_url,
            public_id: action.payload.public_id
          };
          console.log(action.payload.secure_url)
        })
        .addCase(uploadUserProfileThunk.rejected, (state) => {
          state.isImageUploading = false;
        })

        //update user profile / register stage 3
        .addCase(updateUserProfileThunk.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
          state.user = action.payload.user;
          state.isLoading = false;
          state.redirectUrl = '/';
        })
        .addCase(updateUserProfileThunk.rejected, (state) => {
          state.isLoading = false;
        })

        //fetch my data
        .addCase(fetchMyData.fulfilled, (state, action) => {
          state.user = action.payload;
          state.isLoading = false;
          state.lastFetched = Date.now();
        })
        .addCase(fetchMyData.rejected, (state) => {
          state.user = null;
          state.isLoggedIn = false;

        })

        //logout
        .addCase(logoutThunk.fulfilled, (state) => {
          state.user = null;
          state.isLoggedIn = false;
          state.redirectUrl = '/';
          console.log('logout done')

        })
        .addCase(logoutThunk.rejected, (state) => {
          state.isLoading = false;
          state.user = null;
          state.isLoggedIn = false;
          state.redirectUrl = '/';

        })


  },
})

export const {
  setRedirectUrl,
  setIsLoading,
  setIsLoggedIn,
  setIsImageUploading
} = userSlice.actions;
export default userSlice.reducer;