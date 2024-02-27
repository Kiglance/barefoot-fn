import axios from 'axios';

export default axios.create({
  // baseURL: 'https://barefoot-backend-development.herokuapp.com/api/v1/',
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
