/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable prettier/prettier */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import React, { useState } from 'react';
import {
  Box,
  styled,
  // Link,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Link as A,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate, Link } from 'react-router-dom';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import login from '../assets/login.svg';
// import Footer from '../components/footer';
import { loginAction } from '../redux/actions/login.action';
import store from '../redux/store';
import InputField from '../components/input';
import Buttons from '../components/button';
import { urlSerializer } from '../helpers/login.helpers';
import { errorAlert } from '../helpers/signup.helper';
import Header from '../components/landing/header';
import LandingFooter from '../components/landing/footer';
import { retrieveAction } from '../redux/actions/profile.action';

const LoginImage = styled('img')(() => ({
  width: 400,
  height: 320,
  objectFit: 'cover',
  marginBottom: '50px',
}));

const SocialLoginLink = ({ type, variant, startIcon, sx, value }) => (
  <A
    href={`${process.env.REACT_APP_BACKEND_URL}/users/${type}/login/?${
      process.env.REACT_APP_BASE_URL && window.location.origin
    }/social/login`}
  >
    <Buttons variant={variant} startIcon={startIcon} sx={sx} value={value} />
  </A>
);

const mediaStyles = {
  width: {
    xs: 280,
    sm: 350,
    md: 165,
  },
  height: '55px',
  margin: {
    xs: '10px 0px',
    sm: '10px 10px',
  },
  backgroundColor: '#00095E',
  fontSize: '11px',
  color: 'white',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#00095E',
  },
};

const container = {
  paddingTop: '30px',
  display: 'flex',
  flexDirection: {
    xs: 'column',
    md: 'row',
  },
  alignItems: 'center',
  margin: '100px 20px',
  background: 'F8F9FA',
  justifyContent: 'space-evenly',
};

const formSection = {
  width: {
    xs: 300,
    sm: 460,
  },
  // height: {
  //   xs: 550,
  //   md: 530,
  // },
  backgroundColor: '#EBF2FA',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 2,
  padding: '10px 0px',
  margin: '0px 20px',
};

const Login = () => {
  const pages = ['Home', 'About Us', 'Accommodation', 'Sign In', 'Sign Up'];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    // eslint-disable-next-line no-useless-escape
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*[0-9])\w{8,}$/;
    const emailError =
      !email.match(regexEmail) && email.length
        ? 'Invalid email'
        : email.match(regexEmail)
        ? ''
        : 'Email required';
    const passwordError =
      !password.match(regexPassword) && password.length > 6
        ? 'Must have at least one digit and capital letter'
        : password.match(regexPassword)
        ? ''
        : 'Password required';

    setValidationError(() => ({
      email: emailError,
      password: passwordError,
    }));

    return Object.values({ emailError, passwordError }).every(
      (value) => value === '',
    );
  };
  const submit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      await store.dispatch(loginAction({ email, password }));
      if (store.getState().userReducer.isLogged) {
        await store.dispatch(retrieveAction());
        // navigate('/dashboard/trips');
        navigate('/dashboard');
      } else {
        setLoading(false);
        setError(true);
      }
    }
  };

  return (
    <>
      <Header aboutClass="to" />
      <Box sx={container}>
        <Box
          sx={{
            display: {
              xs: 'none',
              sm: 'flex',
            },
          }}
        >
          <LoginImage src={login} alt="login" />
        </Box>
        <Box sx={formSection}>
          <Typography
            variant="h4"
            sx={{
              fontSize: '35px',
              fontWeight: '600',
              color: '#00095E',
              fontFamily: 'Robot, sans-serif',
              paddingTop: '20px',
              paddingBottom: '10px',
            }}
          >
            Login
          </Typography>
          {error ? (
            <Alert variant="outlined" severity="error" sx={errorAlert}>
              {store.getState().userReducer?.error?.data?.message}
            </Alert>
          ) : null}
          <InputField
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            {...(validationError.email && {
              error: true,
              helperText: validationError.email,
            })}
            data-testid="emailInput"
          />
          <InputField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            {...(validationError.password && {
              error: true,
              helperText: validationError.password,
            })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    data-testid="visibility-button"
                  >
                    {showPassword ? (
                      <VisibilityIcon sx={{ color: '#00095E' }} />
                    ) : (
                      <VisibilityOffIcon sx={{ color: '#00095E' }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Buttons
            variant="contained"
            sx={{
              width: {
                xs: 280,
                sm: 350,
              },
              height: 50,
              margin: {
                xs: '10px 0px',
                sm: '20px 0px',
              },
              backgroundColor: '#00095E',
              fontSize: '18px',
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#00095E',
              },
            }}
            value={
              loading ? (
                <CircularProgress
                  sx={{
                    color: 'white',
                  }}
                  size={30}
                  thickness={4}
                />
              ) : (
                'Login'
              )
            }
            onClick={submit}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
            }}
          >
            <SocialLoginLink
              type="google"
              variant="contained"
              startIcon={<GoogleIcon />}
              sx={mediaStyles}
              value="Login with Google"
            />
            <SocialLoginLink
              type="facebook"
              variant="contained"
              startIcon={<FacebookRoundedIcon />}
              sx={mediaStyles}
              value="Login with Facebook"
            />
          </Box>
          <Link
            to="/forgot"
            style={{
              color: '#00095E',
              fontFamily: 'Roboto, sans-serif',
              fontSize: '14px',
              padding: '10px 0px',
            }}
          >
            Forgot your password?
          </Link>
        </Box>
      </Box>
      <LandingFooter />
    </>
  );
};
export default Login;
