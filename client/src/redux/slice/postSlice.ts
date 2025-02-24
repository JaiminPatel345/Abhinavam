import {createSlice} from "@reduxjs/toolkit";
import {createPostThunk} from "@redux/thunks/postsThunk";

 interface IPostSliceInitState {
  isLoading: Boolean;
  redirectUrl: String | null;
}

const initialState:IPostSliceInitState = {
  isLoading: false,
  redirectUrl: null,
}

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setRedirectUrl: (state, action) => {
      state.redirectUrl = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
        .addCase(createPostThunk.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(createPostThunk.fulfilled, (state, action) => {
          state.isLoading = false;
          state.redirectUrl = '/';
        })
        .addCase(createPostThunk.rejected, (state, action) => {
          state.isLoading = false;
        })
  }

})

export const {setIsLoading, setRedirectUrl} = postSlice.actions;
export default postSlice.reducer;