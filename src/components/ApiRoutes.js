const host = 'http://localhost:5050/api/users';
const meetingHost = 'http://localhost:5050/api/v2';

const loginRoute = `${host}/login`;
const registerRoute = `${host}/register`;
const logoutRoute = `${host}/logout`;
const forgotPasswordRoute = `${host}/forgot-password`;
const allowResetPasswordRoute = `${host}/allow-reset-password`;
const resetPasswordRoute = `${host}/reset-password`;
const emailVerificationRoute = `${host}/email-verification`;
const updateProfileRoute = `${host}/update-profile`;

const InstantMeetingRoute = `${meetingHost}/instant-meeting`;
const createMeetingRoute = `${meetingHost}/create-meeting`;
const joinMeetingRoute = `${meetingHost}/join-meeting`;

export {
  joinMeetingRoute,
  createMeetingRoute,
  InstantMeetingRoute,
  updateProfileRoute,
  allowResetPasswordRoute,
  resetPasswordRoute,
  forgotPasswordRoute,
  logoutRoute,
  loginRoute,
  registerRoute,
  emailVerificationRoute,
};
