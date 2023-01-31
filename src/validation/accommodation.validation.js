import * as yup from 'yup';

export const accommodationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  services: yup.string().required('Service is required'),
  amenities: yup.string().required('Amenities required'),
  images: yup.mixed().required('At least one image is required'),
});

export const searchAccommodationSchema = yup
  .object({
    searchAccommodation: yup.string().required('Accommodation required'),
  })
  .required();
