import * as yup from 'yup';

export const TripSchema = yup.object().shape({
  Acomodation: yup.string().required('Acomodation is required'),
  Reason: yup.string().required('Reason is required'),
  Day: yup.number().min(1, 'Must be more than 1 characters'),
});
