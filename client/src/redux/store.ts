import {configureStore} from "@reduxjs/toolkit";
import userReducer from "@/redux/slice/userSlice";
import notificationReducer from "@/redux/slice/notificationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {persistReducer, persistStore} from 'redux-persist';
import postReducer from "@/redux/slice/postSlice";


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
    posts: postReducer
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
        }
      })
})


export const persistor = persistStore(store);