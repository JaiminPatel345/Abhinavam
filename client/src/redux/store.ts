import {configureStore} from "@reduxjs/toolkit";
import userReducer from "@/redux/slice/userSlice";
import notificationReducer from "@/redux/slice/notificationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer
  }

})

