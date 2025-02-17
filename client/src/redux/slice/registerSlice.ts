import {createSlice} from "@reduxjs/toolkit";

const initialState ={
  isLoading: false,
  registerSuccess: false,
  isEmailSend: false,
}

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setRegisterSuccess: (state, action) => {
      state.registerSuccess = action.payload;
    },
    setIsEmailSend: (state, action) => {
      state.isEmailSend = action.payload;
    }
  },
})

export const {setIsLoading, setRegisterSuccess, setIsEmailSend} = registerSlice.actions;
export  default registerSlice.reducer;