import axios from 'axios';

const baseURL = process.env.REACT_APP_BACKEND_URL;
export default axios.create({
  // baseURL: 'https://barefoot-backend-development.herokuapp.com/api/v1/',
  baseURL: `${baseURL}api/v1/`,
  headers: {
    'Content-Type': 'application/json',
  },
});
