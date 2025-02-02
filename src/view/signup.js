import { makeStyles } from '@material-ui/core/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import signup_img from '../assets/signup_img.svg';
import InputField from '../components/input';
import LandingFooter from '../components/landing/footer';
import Header from '../components/landing/header';
import {
  BoxCustomStyles,
  errorAlert,
  FormControlSX,
  getUserLocation,
  SignupBtn,
  SignupImage,
} from '../helpers/signup.helper';
import { getAllLocations } from '../redux/actions/location.action';
import { SignupAction } from '../redux/actions/signup.action';
import store from '../redux/store';

const mainBoxSx = {
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
const typographySx = {
  fontSize: '35px',
  fontWeight: '600',
  color: '#00095E',
  fontFamily: 'Robot, sans-serif',
  paddingTop: '30px',
  paddingBottom: '10px',
};
const Signup = () => {
  const signupState = useSelector((state) => state);
  const message = signupState.signupReducer;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState('');
  const [validationError, setValidationError] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLocation, setFetchLocation] = useState([]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validate = function validate() {
    const regexLetter = /^[A-Za-z]+$/;
    // eslint-disable-next-line no-useless-escape
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*[0-9])\w{8,}$/;
    const emailError =
      email === ''
        ? 'Email is required'
        : email.match(regexEmail)
        ? ''
        : 'Please insert a valid email address';
    const passwordError =
      password === ''
        ? 'Password is required'
        : password.length < 8
        ? 'Password must be 8 characters long'
        : password.match(regexPassword)
        ? ''
        : 'Only letters (lower + upper), and numbers are allowed';
    const fnameError =
      firstName === ''
        ? 'First name is required'
        : firstName.match(regexLetter)
        ? ''
        : 'Invalid input for first name';
    const lnameError =
      lastName === ''
        ? 'Last name is required'
        : lastName.match(regexLetter)
        ? ''
        : 'Invalid input for last name';
    const locationError = location === '' ? 'Location is required' : '';
    setValidationError(() => ({
      firstName: fnameError,
      lastName: lnameError,
      email: emailError,
      password: passwordError,
      location: locationError,
    }));
    return Object.values({
      fnameError,
      lnameError,
      emailError,
      passwordError,
      locationError,
    }).every((value) => value === '');
  };
  /* istanbul ignore next */
  const handleClick = async () => {
    if (validate()) {
      setLoading(true);
      const userInput = {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        location_id:
          location === 'Use my current location'
            ? await getUserLocation()
            : location,
      };
      await store.dispatch(SignupAction(userInput))?.then(async (res) => {
        setLoading(false);
        if (res?.payload?.status && res?.payload?.status !== 409) {
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
        }
      });
    }
  };
  /* istanbul ignore next */
  const populateSelectLocation = async () => {
    await store.dispatch(getAllLocations());
    const { results } = store.getState().locationReducer.data.data;
    setFetchLocation(results);
  };

  useEffect(() => {
    populateSelectLocation();
  }, []);

  const useStyle = makeStyles((theme) => ({
    formControl: {
      [theme.breakpoints.down('xs')]: {
        width: 280,
        height: 20,
        margin: '30px 0px',
      },
      width: 350,
      height: 50,
      margin: '20px 0px',
    },
  }));
  const classes = useStyle();
  return (
    <>
      <Header />
      <Box sx={mainBoxSx}>
        <Box
          sx={{
            display: {
              xs: 'none',
              sm: 'flex',
            },
          }}
        >
          <SignupImage src={signup_img} alt="signup" />
        </Box>
        <Box sx={BoxCustomStyles}>
          <Typography variant="h4" sx={typographySx}>
            Register
          </Typography>
          <Stack
            sx={{
              width: {
                xs: '280px',
                sm: '350px',
                md: '350px',
              },
              marginTop: 1,
            }}
            spacing={2}
          >
            {message.data.message ? (
              <Alert variant="outlined" severity="success" id="alert">
                {message.data.message}
              </Alert>
            ) : null}

            {message.error.message ? (
              <Alert variant="outlined" severity="error" sx={errorAlert}>
                {message.error.message}
              </Alert>
            ) : null}
          </Stack>
          <InputField
            label="First Name"
            type="text"
            variant="outlined"
            id="fname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            {...(validationError.firstName && {
              error: true,
              helperText: validationError.firstName,
            })}
          />
          <InputField
            label="Last Name"
            type="text"
            variant="outlined"
            id="lname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            {...(validationError.lastName && {
              error: true,
              helperText: validationError.lastName,
            })}
          />
          <InputField
            label="Email"
            type="email"
            variant="outlined"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            id="pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <FormControl className={classes.formControl} sx={FormControlSX}>
            <InputLabel id="demo-simple-select-label">Location</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={location}
              /* istanbul ignore next */
              onChange={(e) => setLocation(e.target.value)}
              id="demo-simple-select"
              inputProps={{ 'data-testid': 'location-input' }}
              label="Location"
              {...(validationError.location && {
                error: true,
                helpertext: validationError.location,
              })}
            >
              {fetchLocation.map((locations) => (
                <MenuItem key={locations.id} value={locations.id}>
                  {locations.name}
                </MenuItem>
              ))}
              <MenuItem key="x" value="Use my current location" fontSize="20">
                Use my current location
              </MenuItem>
            </Select>
            <FormHelperText />
          </FormControl>
          <div>
            <SignupBtn variant="contained" onClick={handleClick}>
              {loading ? (
                <CircularProgress
                  sx={{
                    color: 'white',
                  }}
                  size={30}
                  thickness={4}
                />
              ) : (
                'Register'
              )}
            </SignupBtn>
          </div>
        </Box>
      </Box>
      <LandingFooter />
    </>
  );
};
export default Signup;
