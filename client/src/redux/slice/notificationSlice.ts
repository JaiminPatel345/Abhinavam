import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: null,
    type: null,
    title: null,
  },
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