import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState, useEffect, createRef } from 'react';
import IconButton from '@mui/material/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '@mui/material/Modal';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { v4 } from 'uuid';
import moment from 'moment';
import { Toast } from 'bootstrap';
import { getAcc } from '../redux/actions/accommodation.action';
import { getAllLocations } from '../redux/actions/location.action';
import { CreateTrip } from '../redux/actions/CreateTrip.action';
import { updateTrip } from '../redux/actions/UpdateTrip.action';
import { CreateTripSelector, FormControlSX } from '../helpers/signup.helper';
import { retrieveRequests } from '../redux/actions/requester.action';
import InputField from '../components/input';
import Buttons from '../components/button';
import Header from '../components/header';
import RequesterTable from './requester-table';

const format = 'yyyy-MM-dd';
/* istanbul ignore next */
const ListItem = styled('span')(({ theme }) => ({
  margin: theme.spacing(1),
}));
const style = {
  position: 'relative',
  top: { xs: '390px', md: '50%' },
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: 350,
    sm: 420,
    md: 600,
    lg: 580,
  },
  minHeight: {
    xs: 650,
    md: 630,
  },
  bgcolor: 'background.paper',
  border: '2px solid #fff',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  paddingTop: 1,
};
const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));
/* istanbul ignore next */
const RequesterContent = () => {
  const [validationError, setValidationError] = useState({});
  const selectBox = createRef();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [days, setDays] = useState(0);
  const { accommodationReducer, locationReducer, CreateTripReducer } =
    useSelector((state) => state);
  const { loading } = CreateTripReducer;
  const locations = locationReducer.data?.data?.results;
  const [arrivalLocations, setArrivalLocations] = useState([]);
  const [accommodationId, setAccommodationId] = useState(0);
  const [departLocationId, setDepartLocationId] = useState(0);
  const [returnDate, setReturnDate] = useState('');
  const [tripDate, setTripDate] = useState('');
  const [tripTobeEdited, setTripTobeUpdated] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const [locationAccommodations, setLocationAccommodations] = useState([]);
  const { accommodations } = accommodationReducer;
  const getName = (id) => accommodations.find((accom) => accom.id == id);
  const handleClose = () => {
    setTripTobeUpdated({});
    setOpen(false);
    setIsEditing(false);
    setArrivalLocations([]);
    setDepartLocationId(0);
    setReturnDate('');
    setTripDate('');
  };

  const addLocation = () => {
    const newAccomodation = {
      id: v4(),
      accommodation_id: accommodationId,
      days,
    };

    const accomodationExist = arrivalLocations.find(
      (accommodation) =>
        accommodation.accommodation_id === newAccomodation.accommodation_id,
    );

    if (!accommodationId) {
      toast.error('accommodation is required');
      return;
    }
    if (validate()) {
      if (!accomodationExist) {
        setArrivalLocations([...arrivalLocations, newAccomodation]);
        return;
      }

      toast.error("You can't choose the same accommodation twice");
    }
  };
  const validate = () => {
    // eslint-disable-next-line no-useless-escape
    const regexLetter = /^^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;
    const dayone = /^[A-Za-z]+$/;
    const reasonError =
      reason === ''
        ? 'Reasons is required'
        : reason.match(regexLetter)
        ? ''
        : 'Invalid input for Reason';
    const dayError = days > 0 ? '' : 'Day should be greater than Zero';
    setValidationError(() => ({
      reason: reasonError,
      days: dayError,
    }));
    return Object.values({ reasonError, dayError }).every(
      (value) => value === '',
    );
  };

  useEffect(() => {
    if (tripTobeEdited.arrivalLocations) {
      const mp = tripTobeEdited.arrivalLocations.map((loc) => ({
        id: v4(),
        ...loc,
      }));
      setReason(tripTobeEdited.reason);
      setDepartLocationId(tripTobeEdited.depart_location_id);
      setReturnDate(moment(new Date(tripTobeEdited.returnDate)).format(format));
      setTripDate(moment(new Date(tripTobeEdited.tripDate)).format(format));
      setArrivalLocations(mp);
    }
  }, [tripTobeEdited]);

  useEffect(() => {
    if (departLocationId) {
      setLocationAccommodations(
        accommodations.filter(
          (acmdtn) => acmdtn.location_id === departLocationId,
        ),
      );
    }
  }, [departLocationId]);

  const classes = useStyles();
  useEffect(() => {
    getAcc()(dispatch);
    getAllLocations()(dispatch);
  }, []);
  const handleChange = (event) => {
    setAccommodationId(event.target.value);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleSubmitone = async (e) => {
    try {
      e.preventDefault();
      const data = {
        reason,
        depart_location_id: departLocationId,
        tripDate,
        returnDate,
        arrivalLocations: arrivalLocations.map(
          ({ accommodation_id, days }) => ({ accommodation_id, days }),
        ),
      };
      if (!isEditing) {
        const create = await CreateTrip(data)(dispatch);
        toast.success(create.data.message);
        const form = document.getElementById('modalForm');
        form.reset();
        handleClose();
        await dispatch(retrieveRequests(1, 5));
      } else {
        const update = await updateTrip(data, tripTobeEdited.id)(dispatch);
        toast.success(update.data.message);
        handleClose();
        dispatch(retrieveRequests(1, 5));
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = (chipToDelete) => () => {
    setArrivalLocations(() =>
      arrivalLocations.filter((chip) => chip.id !== chipToDelete.id),
    );
  };
  const handleEdit = (dataTobeUpdated) => {
    setIsEditing(true);
    handleOpen();
    setTripTobeUpdated(dataTobeUpdated);
  };

  return (
    <Box>
      <Header title="Trips" />

      <Box>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ '& .MuiBox-root': { maxHeight: 758, overflow: 'auto' } }}
        >
          <Box sx={style}>
            <form id="modalForm" onSubmit={handleSubmitone}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '20px',
                }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h5"
                  sx={{
                    fontSize: '26px',
                    fontWeight: '400',
                    fontFamily: 'Josefin Sans, sans-serif',
                    color: '#00095E',
                  }}
                >
                  {!isEditing ? 'Create Trip' : 'Edit Trip'}
                </Typography>
                <IconButton
                  onClick={handleClose}
                  sx={{
                    color: '#00095E',
                  }}
                >
                  <CloseIcon data-testid="close-icon" />
                </IconButton>
              </div>
              <FormControl
                fullWidth
                className={classes.formControl}
                sx={CreateTripSelector}
              >
                <InputLabel id="demo-simple-select-label">Location</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  defaultValue={tripTobeEdited?.depart_location_id}
                  onChange={(e) => setDepartLocationId(e.target.value)}
                  label="Location"
                  ref={selectBox}
                >
                  {locations?.map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <InputField
                label="Reason"
                type="text"
                big
                variant="outlined"
                defaultValue={tripTobeEdited?.reason}
                onChange={(e) => setReason(e.target.value)}
                data-testid="emailInput"
                value={reason}
                {...(validationError.reason && {
                  error: true,
                  helperText: validationError.reason,
                })}
              />
              <FormControl
                fullWidth
                className={classes.formControl}
                sx={CreateTripSelector}
              >
                <InputLabel id="demo-simple-select-label">
                  Accomodation
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  onChange={handleChange}
                  label="Acomodation"
                  ref={selectBox}
                >
                  {locationAccommodations.map((accomodation) => (
                    <MenuItem key={accomodation.id} value={accomodation.id}>
                      {accomodation.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <InputField
                label="Day"
                big
                type="number"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                {...(validationError.days && {
                  error: true,
                  helperText: validationError.days,
                })}
              />
              <Buttons
                variant="contained"
                onClick={addLocation}
                sx={{
                  width: {
                    xs: 280,
                    sm: '100%',
                  },
                  height: 50,
                  margin: {
                    xs: '20px 0px',
                    sm: '5px 0px',
                  },
                  bottom: '5px',
                  backgroundColor: '#00095E',
                  fontSize: '18px',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#00095E',
                  },
                }}
                value="+ Add Accomodation"
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                {arrivalLocations.map((data) => (
                  <ListItem key={data.accommodation_id}>
                    <Chip
                      label={`${getName(data.accommodation_id).name} -${
                        data.days
                      } Days`}
                      onDelete={handleDelete(data)}
                      size="9px"
                    />
                  </ListItem>
                ))}
              </div>

              <Typography
                id="modal-modal-title"
                sx={{
                  fontSize: '18px',
                  color: '#00095E',
                }}
              >
                Trip Date
              </Typography>
              <Stack component="form" noValidate spacing={3}>
                <TextField
                  sx={CreateTripSelector}
                  fullWidth
                  id="date"
                  label=" "
                  type="date"
                  defaultValue={moment(
                    new Date(tripTobeEdited.tripDate),
                  ).format(format)}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => setTripDate(e.target.value)}
                />
              </Stack>
              <Typography
                id="modal-modal-title"
                sx={{
                  fontSize: '18px',
                  color: '#00095E',
                }}
              >
                Return Date
              </Typography>
              <Stack component="form" noValidate spacing={3}>
                <TextField
                  id="date"
                  label=" "
                  type="date"
                  variant="outlined"
                  defaultValue={moment(
                    new Date(tripTobeEdited.returnDate),
                  ).format(format)}
                  onChange={(e) => setReturnDate(e.target.value)}
                  sx={FormControlSX}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>

              <Buttons
                variant="contained"
                type="submit"
                sx={{
                  width: {
                    xs: 280,
                    sm: '100%',
                  },
                  height: 50,
                  margin: {
                    xs: '15px 0px',
                    sm: '10px 0px',
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
                      size={20}
                      thickness={4}
                    />
                  ) : !isEditing ? (
                    'Create Trip'
                  ) : (
                    'Edit Trip'
                  )
                }
              />
            </form>
          </Box>
        </Modal>
      </Box>
      <RequesterTable handleOpen={handleOpen} handleEdit={handleEdit} />
    </Box>
  );
};
export default RequesterContent;
