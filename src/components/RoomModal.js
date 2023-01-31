import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Select,
  MenuItem,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import { FormControlSX, SignupBtn } from '../helpers/signup.helper';
import {
  fetchAccommodationsAction,
  fetchSingleAccommodation,
} from '../redux/actions/accommodation.action';
import { roomSchema } from '../validation/room.validations';
import ControlledInputs from './controlledInput';
import ControlledMultipleFileInput from './controlledMultipleFileInput';
import { createRoomAction } from '../redux/actions/room.action';
import store from '../redux/store';

export const RoomModal = ({ open, title, handleClose, inputData }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const accommodations = useSelector(
    (state) => state.fetchAllAccommodations?.accommodations?.data?.results,
  );
  const loading = useSelector((state) => state.createRoomReducer.pending);
  const updateLoading = useSelector(
    (state) => state.updateAccommodationReducer.pending,
  );

  useEffect(() => {
    fetchAccommodationsAction(1, 10);
  }, [dispatch]);
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      price: '',
      details: '',
    },
    resolver: yupResolver(roomSchema),
  });
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('price', data.price);
    formData.append('details', data.details);
    for (let i = 0; i <= data.images.length; i++) {
      formData.append('images', data.images[i]);
    }
    if (title === 'Create Room') {
      await store.dispatch(createRoomAction(formData, id));
    }
    if (store.getState().createRoomReducer.room.room) {
      reset();
      handleClose();
      dispatch(fetchSingleAccommodation(id));
    }
  };
  const style = {
    position: 'relative',
    top: '400px',
    left: { xs: '195px', sm: '300px', md: '600px', lg: '750px', xl: '750px' },
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 350,
      sm: 420,
      md: 420,
      lg: 420,
      xl: 420,
    },
    // minHeight: {
    //   xs: 550,
    //   md: 530,
    // },
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
  };
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
  return (
    <Box>
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
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <ControlledInputs
                  name="price"
                  label="Price"
                  control={control}
                  {...(errors?.price && {
                    error: true,
                    helperText: errors.price.message,
                  })}
                />
              </Grid>
              <Grid item>
                <ControlledInputs
                  name="details"
                  label="Details"
                  control={control}
                  {...(errors?.details && {
                    error: true,
                    helperText: errors.details.message,
                  })}
                />
              </Grid>
              {/* <FormControl className={classes.formControl} sx={FormControlSX}>
              <InputLabel id="demo-simple-select-label">
                Accommodation
              </InputLabel>
              <Controller
                name="accommodation"
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
                    label="Accommodation"
                  >
                    {accommodations?.map((accommodation) => (
                      <MenuItem key={accommodation.id} value={accommodation.id}>
                        {accommodation.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl> */}
              <Grid item>
                <ControlledMultipleFileInput
                  name="images"
                  control={control}
                  errorMessage={errors?.images?.message}
                />
              </Grid>
              <Grid item>
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
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};
