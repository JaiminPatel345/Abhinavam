import {configureStore} from "@reduxjs/toolkit";
import userReducer from "@/redux/slice/userSlice";
import notificationReducer from "@/redux/slice/notificationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer, persistStore} from 'redux-persist';
import postReducer from "@/redux/slice/postSlice";
import commentReducer from "@/redux/slice/commentSlice";
import navigationReducer from "@/redux/slice/navigationSlice";
import followReducer from "@/redux/slice/followSlice";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'],
  timeout: 0, // Disable timeout
  debug: __DEV__,// Enable debug only in development


};


export const persistedUserReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    notification: notificationReducer,
    posts: postReducer,
    comments: commentReducer,
    navigation: navigationReducer,
    follow: followReducer,

  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
        }
      })
})


export const persistor = persistStore(store);