import { Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfilePageScreen from './screens/ProfilePageScreen';
import EmailVerificationScreen from './screens/EmailVerificationScreen';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import JoinMeetingScreen from './screens/JoinMeetingScreen';
import MeetingRoomScreen from './screens/MeetingRoomScreen';
import CreateMeetingScreen from './screens/CreateMeetingScreen';

const App = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
        <Route
          path="/email-verification"
          element={<EmailVerificationScreen />}
        />
        <Route path="/" element={<HomeScreen />} />

        <Route path="/meeting-room" element={<MeetingRoomScreen />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/create-meeting" element={<CreateMeetingScreen />} />

          <Route path="/join-meeting" element={<JoinMeetingScreen />} />
          <Route path="/profile" element={<ProfilePageScreen />} />
        </Route>

        {/* <Route path="*" element={<NotFoundScreen />} /> */}
      </Routes>
    </div>
  );
};

export default App;
