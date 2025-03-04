// src/redux/slices/navigationSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {showNotification} from "@/redux/slice/notificationSlice";

interface NavigationState {
  showTabBar: boolean;
  currentRoute: string;
}

const initialState: NavigationState = {
  showTabBar: true,
  currentRoute: '/'
};

// Routes that should hide the tab bar
const HIDDEN_TAB_ROUTES = ['/auth'];

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentRoute: (state, action: PayloadAction<string>) => {
      state.currentRoute = action.payload;
      // Automatically determine tab bar visibility based on route
      state.showTabBar = !HIDDEN_TAB_ROUTES.some(route =>
          action.payload.startsWith(route)
      );
    },
    setTabBarVisibility: (state, action: PayloadAction<boolean>) => {
      state.showTabBar = action.payload;
    }
  }
});

export const {setCurrentRoute, setTabBarVisibility} = navigationSlice.actions;
export default navigationSlice.reducer;
