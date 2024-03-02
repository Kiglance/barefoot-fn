import { Box, styled, Container, CssBaseline, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import email from '../assets/email.svg';
import store from '../redux/store';
import useCountdown from '../helpers/useCountDown';
import { emailVerificationAction } from '../redux/actions/verification.action';
import {
  EmailImage,
  bodySx,
  commonStyles,
  mainBoxSx,
  linkStyles,
} from '../helpers/emailVerification.helpers';

const feURL = process.env.REACT_APP_BASE_URL;

const EmailVerification = () => {
  const [verification, setVerification] = useState({});
  const endTime = new Date().getTime() + 6000;
  const [timeLeft, setEndTime] = useCountdown(endTime);
  const minutes = Math.floor(timeLeft / 60000) % 60;
  const seconds = Math.floor(timeLeft / 1000) % 60;
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  const verifyEmail = async () => {
    await store.dispatch(emailVerificationAction(token));
    const results = store.getState().emailVerificationReducer.data;
    setVerification(results);
  };
  useEffect(() => {
    verifyEmail();
  }, []);
  seconds === 0 && verification.status === 200
    ? (window.location.href = `${feURL}/login`)
    : '';
  return (
    <>
      <Box sx={mainBoxSx}>
        <Box
          sx={{
            display: {
              xs: 'none',
              sm: 'flex',
            },
          }}
        >
          <EmailImage src={email} alt="email" />
        </Box>
        <Box sx={bodySx}>
          <Typography
            variant="h4"
            sx={commonStyles}
            fontSize="35px"
            fontWeight="600"
            paddingTop="150px"
          >
            {verification.status === 200
              ? 'Congratulations!'
              : 'Verification Failed!'}
          </Typography>
          <Typography
            variant="h4"
            sx={commonStyles}
            fontSize="30px"
            fontWeight="300"
            paddingTop="60px"
          >
            {verification.status === 200
              ? verification.message
              : 'Invalid verification link'}
          </Typography>
          <Typography
            variant="h5"
            sx={commonStyles}
            fontWeight="150"
            fontSize="20px"
            paddingTop="10px"
          >
            {verification.status === 200 ? (
              <div>
                You will be redirected to sign in page in:
                <Typography variant="h1">
                  0{minutes}:0{seconds} ''
                </Typography>
              </div>
            ) : (
              `We couldn't verify your email! Please check your email again or contact system admin.`
            )}
          </Typography>
          {verification.status === 200 ? (
            <Link to="/login" style={linkStyles}>
              Sign In Now
            </Link>
          ) : (
            ''
          )}
        </Box>
      </Box>
    </>
  );
};
export default EmailVerification;
