/* eslint-disable import/prefer-default-export */
import * as yup from 'yup';

const profileSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  age: yup.number().typeError('Age must be a number').min(0),
  occupation: yup.string().nullable(),
  country: yup.string().nullable(),
  nationality: yup.string().nullable(),
  language: yup.string().nullable(),
  gender: yup.string().nullable(),
  dateOfBirth: yup.string().nullable(),
  location: yup.string().nullable(),
  bio: yup.string().nullable(),
  appNotification: yup.bool(),
  emailNotification: yup.bool(),
  profilePicture: yup.mixed(),
});

export { profileSchema };
