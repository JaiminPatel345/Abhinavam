import {configureStore} from "@reduxjs/toolkit";
import userReducer from "@/redux/slice/userSlice";

export const store = configureStore({
    reducer: {
        userReducer,
    }
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
