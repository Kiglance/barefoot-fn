/* eslint-disable import/prefer-default-export */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { getAllLocations } from '../redux/actions/location.action';
import store from '../redux/store';
import { FormControlSX, SignupBtn } from '../helpers/signup.helper';
import {
  createAccommodationAction,
  fetchAccommodationsAction,
  updateAccommodationAction,
} from '../redux/actions/accommodation.action';
import { accommodationSchema } from '../validation/accommodation.validation';
import ControlledInputs from './controlledInput';
import ControlledMultipleFileInput from './controlledMultipleFileInput';

const style = {
  position: 'relative',
  top: '300px',
  left: { xs: '195px', sm: '300px', md: '600px', lg: '750px', xl: '750px' },
  transform: 'translate(-50%, -50%)',
  width: {
    xs: 350,
    sm: 420,
    md: 420,
    lg: 420,
    xl: 420,
  },
  maxHeight: {
    xs: '90%',
    md: '90%',
  },
  bgcolor: 'background.paper',
  border: '2px solid #fff',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  overflowY: 'scroll',
};

export const AccommodationModal = ({ open, title, handleClose, inputData }) => {
  const [fetchLocation, setFetchLocation] = useState([]);
  const dispatch = useDispatch();

  const populateSelectLocation = async () => {
    await store.dispatch(getAllLocations());
    const { results } = store.getState().locationReducer.data.data;
    setFetchLocation(results);
    dispatch(fetchAccommodationsAction(1, 6));
  };
  useEffect(() => {
    populateSelectLocation();
  }, [dispatch]);

  const useStyle = makeStyles((theme) => ({
    formControl: {
      [theme.breakpoints.down('xs')]: {
        width: 280,
        minHeight: 20,
        margin: '30px 0px',
      },
      width: 350,
      minHeight: 50,
      margin: '20px 0px',
    },
  }));
  const classes = useStyle();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      services: '',
      amenities: '',
      location_id: '',
    },
    resolver: yupResolver(accommodationSchema),
  });

  const onSubmit = async (data) => {
    const services = data.services.split(',');
    const amenities = data.amenities.split(',');
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    services.forEach((service) => {
      formData.append('services', service.trim());
    });
    amenities.forEach((amenity) => {
      formData.append('amenities', amenity.trim());
    });
    for (let i = 0; i <= data.images.length; i++) {
      formData.append('images', data.images[i]);
    }
    formData.append('location_id', data.location_id);
    if (title === 'Create Accommodation') {
      await store.dispatch(createAccommodationAction(formData));
    } else if (title === 'Update Accommodation') {
      await store.dispatch(updateAccommodationAction(inputData.id, formData));
    }
    if (
      store.getState().createAccommodationReducer.accommodations?.data ||
      store.getState().updateAccommodationReducer.accommodations?.data
    ) {
      reset();
      handleClose();
      dispatch(fetchAccommodationsAction(1, 6));
    }
  };
  if (title === 'Update Accommodation' && inputData?.name) {
    setValue('name', inputData?.name);
    setValue('description', inputData?.description);
    setValue('services', inputData?.services.toString());
    setValue('amenities', inputData?.amenities.toString());
    setValue('location_id', inputData?.location_id);
    setValue('images', inputData?.images);
  }
  const loading = useSelector(
    (state) => state.createAccommodationReducer.pending,
  );
  const updateLoading = useSelector(
    (state) => state.updateAccommodationReducer.pending,
  );
  return (
    <Box
      sx={{
        maxHeight: '300px',
        overflowY: 'scroll',
      }}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid
              container
              sx={{ display: 'flex' }}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                id="modal-modal-title"
                variant="h5"
                sx={{
                  fontSize: { xs: '20px', md: '26px' },
                  fontWeight: '400',
                  fontFamily: 'Josefin Sans, sans-serif',
                  color: '#00095E',
                }}
              >
                {title}
              </Typography>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: '#00095E',
                  bottom: '20px',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <ControlledInputs
              name="name"
              label="Name"
              control={control}
              {...(errors?.name && {
                error: true,
                helperText: errors.name.message,
              })}
            />

            <ControlledInputs
              name="description"
              label="Description"
              control={control}
              {...(errors?.description && {
                error: true,
                helperText: errors.description.message,
              })}
            />
            <ControlledInputs
              name="services"
              label="Services"
              control={control}
              helperText="Comma separated. Ex: Service1,Service2,..."
              {...(errors?.services && {
                error: true,
                helperText: errors.services.message,
              })}
            />
            <ControlledInputs
              name="amenities"
              label="Amenities"
              control={control}
              helperText="Comma separated. Ex: Amenity1,Amenity2,..."
              {...(errors?.amenities && {
                error: true,
                helperText: errors.amenities.message,
              })}
            />

            <FormControl className={classes.formControl} sx={FormControlSX}>
              <InputLabel id="demo-simple-select-label">Location</InputLabel>
              <Controller
                name="location_id"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    labelId="acc-select-label"
                    value={value}
                    onChange={onChange}
                    id="accommodation-select"
                    inputProps={{
                      'data-testid': 'accommodation-input',
                    }}
                    label="Location"
                  >
                    {fetchLocation.map((locations) => (
                      <MenuItem key={locations.id} value={locations.id}>
                        {locations.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
            <ControlledMultipleFileInput
              name="images"
              control={control}
              errorMessage={errors?.images?.message}
            />

            <SignupBtn variant="contained" type="submit">
              {loading || updateLoading ? (
                <CircularProgress
                  sx={{
                    color: 'white',
                  }}
                  size={30}
                  thickness={4}
                />
              ) : (
                `${title}`
              )}
            </SignupBtn>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};
