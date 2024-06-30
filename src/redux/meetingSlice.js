import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  meetingDetails: localStorage.getItem('meetingDetails')
    ? JSON.parse(localStorage.getItem('meetingDetails'))
    : null,

  meetingAccess: localStorage.getItem('meetingAccess')
    ? JSON.parse(localStorage.getItem('meetingAccess'))
    : null,
};

const meetingSlice = createSlice({
  name: 'meeting',
  initialState,
  reducers: {
    meetingInfo: (state, action) => {
      state.meetingDetails = action.payload;
      localStorage.setItem(
        'meetingDetails',
        JSON.stringify(state.meetingDetails)
      );
    },

    joinMeetingSuccess: (state, action) => {
      state.meetingAccess = action.payload;
      localStorage.setItem(
        'meetingAccess',
        JSON.stringify(state.meetingAccess)
      );
    },
  },
});

export const { meetingInfo, joinMeetingSuccess } = meetingSlice.actions;
export default meetingSlice.reducer;
