import { Star } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSingleAccommodation } from '../redux/actions/accommodation.action';
import { Rating } from '../redux/actions/Rating.action';

/* istanbul ignore next */
const RatingModal = ({ open, title, handleClose, pathId }) => {
  const [rates] = useState([1, 2, 3, 4, 5]);
  const [rate, setRate] = useState(0);
  const dispatch = useDispatch();
  const style = {
    position: 'relative',
    top: '400px',
    left: { xs: '195px', sm: '300px', md: '600px', lg: '750px', xl: '750px' },
    transform: 'translate(-50%, -50%)',
    width: {
      xs: 350,
      sm: 420,
      md: 420,
      lg: 220,
      xl: 220,
    },
    minHeight: {
      xs: 150,
      md: 130,
    },
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
  };
  /* istanbul ignore next */
  // const useStyle = makeStyles((theme) => ({
  //   formControl: {
  //     [theme.breakpoints.down('xs')]: {
  //       width: 280,
  //       minHeight: 20,
  //       margin: '30px 0px',
  //     },
  //     width: 350,
  //     minHeight: 50,
  //     margin: '20px 0px',
  //   },
  // }));
  /* istanbul ignore next */
  const rating = async () => {
    if (rate) {
      await Rating(pathId, rate);
      await dispatch(fetchSingleAccommodation(pathId));
      handleClose();
    }
  };
  useEffect(() => {
    rating();
  }, [rate]);

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            onClick={handleClose}
            sx={{
              color: '#00095E',
              bottom: '20px',
              right: '1px',
              float: 'right',
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            id="modal-modal-title"
            variant="h5"
            sx={{
              fontSize: '20px',
              fontWeight: '400',
              fontFamily: 'Josefin Sans, sans-serif',
              color: '#00095E',
            }}
          >
            {title}
          </Typography>
          <Stack direction="row">
            {rates.map((element, index) => (
              <Star
                key={index}
                sx={{ color: rate >= element ? '#FFC800' : '#000' }}
                onClick={() => setRate(element)}
              />
            ))}
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
};

export default RatingModal;
