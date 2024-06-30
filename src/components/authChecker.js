import { jwtDecode } from 'jwt-decode';

import { logoutSuccess } from '../redux/userSlice';

const authChecker = (token, dispatch) => {
  const decodedToken = jwtDecode(token);

  const expirationTime = decodedToken.exp * 1000;
  const currentTime = Date.now();
  if (expirationTime < currentTime) {
    dispatch(logoutSuccess());
  }
};

export default authChecker;
