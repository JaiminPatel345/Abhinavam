import { createSlice } from '@reduxjs/toolkit';

export interface NotificationState {
  message: string | null;
  type: 'SUCCESS' | 'DANGER' | 'INFO' | 'WARNING' | null ;
  title: string | null;
}

const initialState: NotificationState = {
  message: null,
  type: 'INFO',
  title: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    showNotification: (state, action) => {
      const { message, type, title } = action.payload;
      state.message = message;
      state.type = type;
      state.title = title;

    },
    clearNotification: (state) => {
      state.message = null;
      state.type = null;
      state.title = null;
    },
  },
});

export const { showNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;