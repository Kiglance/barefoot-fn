/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/jsx-props-no-spreading */
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Assignmanager from '../components/assign_manager';
import { ReadOneTrip } from '../components/read_one_trip';
import UserSettingsModal from '../components/user_role';
import DashboardPreview from '../layouts/requester';
import { AccommodationDetails } from '../view/accommodationDetails';
import AccommodationPage from '../view/allAccommodations';
import BookingPage from '../view/bookingPage';
import ChatPage from '../view/chatPage';
import Forgot from '../view/Forgot';
import GoogleLogin from '../view/google_login';
import LandingPage from '../view/index';
import Login from '../view/login';
import Profile from '../view/profile';
import RequesterContent from '../view/requesterContent';
import ResetPassword from '../view/ResetPassword';
import Signup from '../view/signup';
import TravelAdmin from '../view/travel-admin';
import EmailVerification from '../view/verifyEmail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1A2D6D',
      text: '#fff',
    },
    secondary: {
      main: '#0B2C5f',
      text: '#fff',
    },
    error: {
      main: '#EC5C5C',
      text: '#1A2D6D',
    },
    success: {
      main: '#0ABDA0',
      text: '#1A2D6D',
    },
    backgroundLightBlue: {
      main: '#EBF2FA',
      text: '#1A2D6D',
    },
    // text: {
    //   primary: '#0000',
    //   secondary: '#fff',
    // },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    margin: 0,
    color: '#1A2D6D',
    '@media (max-width:600px)': {
      fontSize: 12,
    },
  },
});

const AllRoutes = (props) => (
  <ThemeProvider theme={theme}>
    <ToastContainer />
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/social/login" element={<GoogleLogin />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route path="/accommodations" element={<AccommodationPage />} />
        <Route
          exact
          path="accommodations/:id"
          element={<AccommodationDetails />}
        />
        <Route
          exact
          path="/verify"
          element={<EmailVerification {...props} />}
        />
        <Route exact path="/forgot" element={<Forgot />} />
        <Route
          exact
          path="/resetPassword"
          element={<ResetPassword {...props} />}
        />
        <Route exact path="/dashboard/*" element={<DashboardPreview />}>
          <Route
            exact
            path=""
            element={<Navigate to="trips" replace="true" />}
          />

          <Route exact path="trips" element={<RequesterContent />} />
          <Route exact path="trips/:id" element={<ReadOneTrip />} />
          <Route exact path="profile" element={<Profile />} />
          <Route exact path="roles" element={<UserSettingsModal />} />
          <Route exact path="settings" element={<Assignmanager />} />
          <Route exact path="accommodations" element={<TravelAdmin />} />
          <Route exact path="bookings" element={<BookingPage />} />
          <Route
            exact
            path="accommodations/:id"
            element={<AccommodationDetails />}
          />
          <Route exact path="chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default AllRoutes;
