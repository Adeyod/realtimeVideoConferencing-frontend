import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  error: false,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginStop: (state) => {
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(state.user));
      state.error = false;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    updateUserSuccess: (state, action) => {
      state.user = { ...state.user, user: action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
});

export const {
  updateUserSuccess,
  logoutSuccess,
  loginStop,
  loginFailure,
  loginSuccess,
  loginStart,
} = userSlice.actions;
export default userSlice.reducer;
