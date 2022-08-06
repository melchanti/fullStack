import { createSlice } from "@reduxjs/toolkit";

let notificationTimeoutId;
const initialState = "";
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationReducer(state, action) {
      return action.payload;
    },
    removeNotificationReducer(state, action) {
      return "";
    }
  }
});

export const {setNotificationReducer, removeNotificationReducer} = notificationSlice.actions;

export const setNotification = (content, time) => {
  return dispatch => {
    clearTimeout(notificationTimeoutId);
    dispatch(setNotificationReducer(content));
    notificationTimeoutId = setTimeout(() => {
      dispatch(removeNotificationReducer(``));
    }, time * 1000);
  }
}
export default notificationSlice.reducer;