/* eslint-disable import/prefer-default-export */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Grid, CardActionArea, Paper, styled } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Add } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import SimpleImageSlider from 'react-simple-image-slider';
import Button from '@mui/material/Button';
import { fetchSingleAccommodation } from '../redux/actions/accommodation.action';
import { Stars } from '../components/landing/stars.component';
import Buttons from '../components/button';
import { unloggedInUser } from '../helpers/login.helpers';
import Header from '../components/landing/header';
import { RoomModal } from '../components/RoomModal';
import { RatingModal } from '../components/RatingModal';
import AccommodationComment from '../components/accommodation/accommodation.comment';

const papeStyles = {
  display: 'flex',
  position: 'relative',
  width: '300px',
  height: '100px',
  background: 'transparent',
  top: '40%',
  color: 'black',
  alignItems: 'center',
  justifyContent: 'space-around',
  flexDirection: 'column',
};
const styles = {
  display: 'flex',
  color: '#00095E',
  margin: 2,
  justifyContent: 'center',
};
const itemStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'justify',
  margin: 1,
};
const cardStyles = {
  elevation: 0,
  marginTop: '20px',
  minHeight: '280px',
  width: { xs: '260px', sm: '210px', md: '260px', lg: '250px' },
};
/* istanbul ignore next */
export const AccommodationDetails = () => {
  const accommodationState = useSelector(
    (state) => state.fetchSingleAccommodationReducer,
  );
  const path = window.location.pathname.split('/');
  const { id } = useParams();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  /* istanbul ignore next */
  const [openRating, setopenRating] = useState(false);
  const handleRating = () => {
    setopenRating(true);
  };
  const handleCloseRating = () => setopenRating(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    dispatch(fetchSingleAccommodation(id));
  }, [id]);
  const role = JSON.parse(localStorage.getItem('userCredentials'));
  const data = accommodationState.accommodations?.data;
  const parsedImages =
    typeof data?.images === 'string' && data?.images
      ? JSON.parse(data?.images)
      : data?.images;

  const parsedServices =
    typeof data?.services === 'string' && data?.services
      ? JSON.parse(data?.services)
      : data?.services;

  const parsedAmenities =
    typeof data?.amenities === 'string' && data?.amenities
      ? JSON.parse(data?.amenities)
      : data?.amenities;

  return (
    <>
      {role.role_id === 0 ? <Header /> : null}
      <Grid container key="main-container" sx={{ marginBottom: '20px' }}>
        {!accommodationState?.pending === true && (
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            sx={{
              height: 500,
              width: '100%',
              backgroundImage: `url(${data?.images[0]})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            <Paper elevation={2} sx={papeStyles}>
              <Typography variant="h4">{data?.name}</Typography>
              <Typography variant="h6">Kigali</Typography>
            </Paper>
          </Grid>
        )}
        {!accommodationState?.pending === true && (
          <Grid
            container
            direction="row"
            justifyContent="center"
            spacing={2}
            margin={2}
          >
            <Grid item md={12} lg={12} sm={12}>
              <Card
                sx={{
                  minHeight: '20px',
                  width: '100%',
                }}
              >
                <Typography sx={styles}>Description:</Typography>

                <CardContent>
                  <Typography textAlign="justify">
                    {data?.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={3} lg={3} sm={4}>
              <Card sx={cardStyles}>
                <Typography sx={styles}>Services:</Typography>

                <CardContent>
                  {parsedServices?.map((service) => (
                    <Grid sx={itemStyles}>
                      <Typography>{service}</Typography>
                    </Grid>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={3} lg={3} sm={4}>
              <Card sx={cardStyles}>
                <Typography sx={styles}>Amenities:</Typography>

                <CardContent>
                  {parsedAmenities?.map((amenity) => (
                    <Grid sx={itemStyles}>
                      <Typography>{amenity}</Typography>
                    </Grid>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={3} lg={3} sm={4}>
              <Card sx={cardStyles}>
                <Typography sx={styles}>Ratings:</Typography>
                <Grid sx={itemStyles}>
                  <Stars rates={data?.rates} />
                </Grid>
                <CardContent>
                  <Grid sx={itemStyles}>
                    <Button
                      onClick={handleRating}
                      variant="contained"
                      sx={{ display: role.role_id === 2 ? 'none' : 'block' }}
                    >
                      Give Ratings
                    </Button>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid container marginTop={2} padding={2} alignContent="center">
              <Typography sx={styles}>Images:</Typography>
              <Grid container spacing={1} marginTop={1} justifyContent="center">
                {parsedImages?.map((image) => (
                  <Grid item lg={3} md={4} sm={6} xs={12}>
                    <img
                      src={image}
                      alt="limg"
                      style={{
                        width: '200px',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
        {!accommodationState.pending === true && <AccommodationComment />}
        {!accommodationState?.pending === true && (
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="center"
            spacing={2}
            sx={{ fontFamily: 'Josefin Sans, sans-serif' }}
          >
            <Typography
              variant="h6"
              sx={{ color: '#00095E', margin: '50px 0 20px 0' }}
            >
              All Rooms in this accommodation
            </Typography>
            <Typography
              variant="h2"
              sx={{ color: '#00095E', fontWeight: 400, marginBottom: '20px' }}
            >
              Rooms
            </Typography>
            {role.role_id === 2 || role.role_id === 1 ? (
              <>
                <Buttons
                  variant="contained"
                  sx={{
                    width: 280,
                    backgroundColor: '#00095E',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: '500',
                    fontSize: '16px',
                    color: 'white',
                    marginBottom: '20px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#00095E',
                    },
                  }}
                  startIcon={<Add />}
                  value="Add a Room"
                  onClick={handleOpen}
                />
              </>
            ) : null}
            <Grid container justifyContent="center" direction="row" padding={2}>
              {!data?.Rooms.length === 0 ? (
                data?.Rooms.map((room) => (
                  <Grid item md={4} lg={3}>
                    <Card sx={{ width: 280, minHeight: 300 }}>
                      <CardActionArea>
                        <SimpleImageSlider
                          width={300}
                          height={150}
                          images={room.images}
                          showBullets
                          showNavs
                        />
                      </CardActionArea>
                      <CardContent>
                        <div
                          style={{
                            display: 'flex',
                            margin: '15px 0 15px 0',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography
                            color="#00095E"
                            component="div"
                            fontFamily="Josefin Sans, sans-serif"
                          >
                            Room: {room.id}
                          </Typography>
                          <Typography
                            color="#FFC800"
                            component="div"
                            fontFamily="Josefin Sans, sans-serif"
                          >
                            {room.price}
                          </Typography>
                        </div>
                        <Typography
                          sx={{
                            color: '#677F8B',
                            textAlign: 'justify',
                            fontSize: '16px',
                            fontFamily: 'Roboto, sans-serif',
                          }}
                        >
                          {room.details}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography>
                  {' '}
                  Oops! No rooms available in this accommodation.
                </Typography>
              )}
            </Grid>
          </Grid>
        )}
        <RoomModal open={open} title="Create Room" handleClose={handleClose} />
        <RatingModal
          open={openRating}
          title="Rate This Accomodation"
          handleClose={handleCloseRating}
          pathId={id}
        />
      </Grid>{' '}
    </>
  );
};
