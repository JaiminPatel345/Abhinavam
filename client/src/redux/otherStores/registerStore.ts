import {configureStore} from "@reduxjs/toolkit";
import registerSlice from "@redux/slice/registerSlice";

export const registerStore = configureStore({
  reducer:{
    register: registerSlice
  }
})