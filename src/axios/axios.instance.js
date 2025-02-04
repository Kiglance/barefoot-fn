/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-concat */
import axios from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL;
const axiosInstance = axios.create({
  baseURL: `${baseURL}`,
  // baseURL: 'https://barefoot-backend-development.herokuapp.com/api/v1',
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (request) => {
    // Do something before request is sent
    request.headers.authorization = `${'Bearer' + ' '}${
      JSON.parse(localStorage.getItem('userCredentials'))?.token
    }`;
    return request;
  },
  (error) =>
    // Do something with request error

    /* istanbul ignore next */
    Promise.reject(error),
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) =>
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    response,
  /* istanbul ignore next */
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    /* istanbul ignore next */
    console.log('====================================');
    console.log(error);
    console.log('====================================');
    if (error?.response?.status === 401) {
      localStorage.removeItem('userCredentials');
      window.location.href = '/login';
    }
    /* istanbul ignore next */
    return Promise.reject(error);
  },
);

export default axiosInstance;
