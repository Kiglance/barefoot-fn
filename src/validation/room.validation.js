/* eslint-disable import/prefer-default-export */
import * as yup from 'yup';

const roomSchema = yup.object().shape({
  checkInDate: yup.string().required('checkin date is required'),
  checkOutDate: yup.string().required('checkout date is required'),
});

export { roomSchema };
