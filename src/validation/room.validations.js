import * as yup from 'yup';

export const roomSchema = yup.object().shape({
  details: yup.string().required('Details are required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .min(0, 'Minimum price is 0'),
  images: yup.mixed().required('At least one image is required'),
});

export const searchRoomSchema = yup.object().shape({
  searchInput: yup
    .number()
    .typeError('Room ID should be a number')
    .min(1, 'Invalid Room ID'),
});
