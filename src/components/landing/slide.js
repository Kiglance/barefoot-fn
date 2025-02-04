import { LocationCity } from '@mui/icons-material';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  styled,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import 'react-multi-carousel/lib/styles.css';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import { getLoc } from '../../redux/actions/location.action';
import store from '../../redux/store';
import { Spinner } from './spinner';

const Stylepaper = styled(Paper)(({ theme }) => ({
  height: '220px',
  width: '90%',
  marginTop: '40px',
  marginLeft: '15%',
  [theme?.breakpoints.up('sm')]: {
    height: '220px',
    marginLeft: '10%',
  },
}));

const PrevArrow = (props) => {
  const { onClick, style } = props;
  return (
    <Box
      component="div"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick();
      }}
      className="slick-arrow slick-prev"
      style={{ ...style, display: 'block' }}
      role="button"
      tabIndex={0}
      sx={{
        width: 'max-content',
        height: 'max-content',
        position: 'absolute',
        top: '55%',
        left: '-65px',
        '&::before': {
          display: 'none',
        },
        zIndex: 1,
      }}
    >
      <IconButton>
        <ArrowLeftIcon fontSize="large" color="primary" />
      </IconButton>
    </Box>
  );
};
const NextArrow = (props) => {
  const { onClick, style } = props;
  return (
    <Box
      component="div"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick();
      }}
      className="slick-arrow slick-next"
      style={{ ...style, display: 'block' }}
      role="button"
      tabIndex={0}
      sx={{
        width: 'max-content',
        height: 'max-content',
        position: 'absolute',
        top: '55%',
        right: '-65px',
        '&::after': {
          display: 'none',
        },
        zIndex: 1,
      }}
    >
      <IconButton>
        <ArrowRightIcon fontSize="large" color="primary" />
      </IconButton>
    </Box>
  );
};

const Slide = () => {
  const locations = useSelector((state) => state.landingReducer);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    store.dispatch(getLoc());
  }, []);

  const responsive = [
    { breakPoint: 4000, cardsToShow: 3 },
    { breakPoint: 1024, cardsToShow: 3 },
    { breakPoint: 800, cardsToShow: 3 },
    { breakPoint: 600, cardsToShow: 2 },
    { breakPoint: 0, cardsToShow: 1 },
  ];

  useEffect(() => {
    if (locations.locations.length > 2) {
      setLoading(false);
    }
  });

  return (
    <Grid container direction="column" alignItems="center" paddingTop={10}>
      <Grid item textAlign="center">
        <Typography variant="h6" color="#7EA0FF">
          Checkout our most travelled locations
        </Typography>
        <Typography variant="h4" color="#00095E">
          LOCATIONS
        </Typography>
      </Grid>
      {loading === true ? (
        <Grid item paddingTop={10}>
          <Spinner />
        </Grid>
      ) : (
        <Grid
          item
          width={{
            md: '60%',
            sm: '65%',
            xs: '75%',
          }}
          paddingTop={10}
          className="slider-container"
        >
          <Slider
            responsive={responsive}
            autoplay
            autoplaySpeed={1000}
            dots
            infinite
            slidesToShow={3}
            slidesToScroll={1}
            speed={500}
            arrows
            prevArrow={<PrevArrow />}
            nextArrow={<NextArrow />}
          >
            {locations.locations.map((value) => (
              <div key={value.id}>
                <Stylepaper elevation={3}>
                  <div
                    style={{
                      width: '100%',
                      height: '145px',
                      background: '#F8F9FA',
                    }}
                  >
                    <LocationCity
                      sx={{ color: '#00095E', width: '50%', height: '145px' }}
                    />
                  </div>
                  <p
                    style={{
                      color: '#00095E',
                      float: 'left',
                      marginTop: '40px',
                      marginLeft: '10px',
                    }}
                  >
                    {value.name}
                  </p>
                  <p
                    style={{
                      color: '#7EA0FF',
                      float: 'left',
                      position: 'absolute',
                      bottom: '7%',
                      marginLeft: '10px',
                    }}
                  >
                    {value.country}
                  </p>
                </Stylepaper>
              </div>
            ))}
          </Slider>
        </Grid>
      )}
    </Grid>
  );
};

export default Slide;
