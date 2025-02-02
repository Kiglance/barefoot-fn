import { SIGNUP_FAILED, SIGNUP_SUCCESSFUL } from '../types/signup.types';
import axios from '../../axios/axios.instance';

export const signupSucces = (data) => ({
  type: SIGNUP_SUCCESSFUL,
  payload: data,
  loading: false,
});
export const signupFail = (error) => ({
  type: SIGNUP_FAILED,
  payload: error,
  loading: false,
});

export const SignupAction = (userData) => (dispatch) =>
  axios(`/users/register`, {
    method: 'POST',
    data: userData,
  })
    .then((res) => {
      /* istanbul ignore next */
      console.log(res);
      return res.data.status === 201
        ? dispatch(signupSucces(res.data))
        : dispatch(signupFail(res.data));
    })
    .catch((error) => {
      /* istanbul ignore next */
      console.log(error);
      return dispatch(signupFail(error.response.data));
    });
