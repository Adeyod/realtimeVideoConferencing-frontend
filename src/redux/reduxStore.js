import { configureStore } from '@reduxjs/toolkit';

import userReducer from './userSlice';
import meetingReducer from './meetingSlice';

const globalStore = configureStore({
  reducer: {
    user: userReducer,
    meeting: meetingReducer,
  },
});
// The store now has redux-thunk added and the Redux DevTools Extension is turned on

export { globalStore };
