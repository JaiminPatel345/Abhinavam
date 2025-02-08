import {configureStore} from "@reduxjs/toolkit";
import userReducer from "@/redux/slice/userSlice";
import notificationReducer from "@/redux/slice/notificationSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer
  }

})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
