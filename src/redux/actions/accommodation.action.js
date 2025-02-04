/* eslint-disable camelcase */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-vars */
/* eslint-disable import/prefer-default-export */
import { toast } from 'react-toastify';
import {
  FETCH_ACCOMMODATIONS_PENDING,
  FETCH_ACCOMMODATIONS_SUCCESS,
  FETCH_ACCOMMODATIONS_FAILED,
  CREATE_ACCOMMODATION_PENDING,
  CREATE_ACCOMMODATION_SUCCESS,
  CREATE_ACCOMMODATION_FAILED,
  FETCH_SINGLE_ACCOMMODATION_SUCCESS,
  FETCH_SINGLE_ACCOMMODATION_PENDING,
  FETCH_SINGLE_ACCOMMODATION_FAILED,
  DELETE_ACCOMMODATION_PENDING,
  DELETE_ACCOMMODATION_SUCCESS,
  DELETE_ACCOMMODATION_FAILED,
  UPDATE_ACCOMMODATION_PENDING,
  UPDATE_ACCOMMODATION_SUCCESS,
  UPDATE_ACCOMMODATION_FAILED,
  FILTER_ACCOMMODATION,
  FETCH_COMMENTS,
  CREATE_COMMENTS,
  UPDATE_COMMENTS,
  DELETE_COMMENTS,
  LIKE_ACCOMMODATION,
  LIKE_ACCOMMODATION_FAILED,
} from '../types/accommodation.types';
import axios from '../../axios/axios.instance';
import { FETCHACCOMMODATIONS } from '../actionTypes/actionTypes';
import axiosInstance from '../../axios/axios.instance';
/* istanbul ignore next */
export const getAccommodations = (payload) => (dispatch) => {
  dispatch({
    type: FETCHACCOMMODATIONS,
    payload,
  });
};

export const getAcc = () => async (dispatch) => {
  axiosInstance.get('/accommodations?page=1&limit=5').then((res) => {
    /* istanbul ignore next */
    dispatch(getAccommodations(res.data.data.results));
  });
};
/* istanbul ignore next */
export const fetchSingleAccommodation = (acc_id) => async (dispatch) => {
  try {
    const res = await axiosInstance.get(`/accommodations/${acc_id}`);
    dispatch({
      type: FETCH_SINGLE_ACCOMMODATION_SUCCESS,
      payload: res.data,
      pending: false,
      error: null,
    });
  } catch (error) {
    dispatch({
      type: FETCH_SINGLE_ACCOMMODATION_FAILED,
      pending: false,
      payload: error.response.data,
    });
  }
};
/* istanbul ignore next */
export const fetchAccommodationsAction = (page, limit) => async (dispatch) => {
  try {
    await dispatch({ type: FETCH_ACCOMMODATIONS_PENDING });
    const res = await axiosInstance.get(
      `/accommodations/?page=${page}&limit=${limit}`,
    );
    dispatch({
      type: FETCH_ACCOMMODATIONS_SUCCESS,
      payload: res.data,
      pending: false,
      error: null,
    });
  } catch (err) {
    dispatch({
      type: FETCH_ACCOMMODATIONS_FAILED,
      pending: false,
      payload: err.response.data,
    });
  }
};
/* istanbul ignore next */
export const createAccommodationAction =
  (accommodation) => async (dispatch) => {
    try {
      dispatch({ type: CREATE_ACCOMMODATION_PENDING });
      const res = await axios('/accommodations', {
        method: 'POST',
        data: accommodation,
      });
      dispatch({
        type: CREATE_ACCOMMODATION_SUCCESS,
        payload: res,
        error: null,
      });
      toast.success(res?.data?.message);
    } catch (err) {
      toast.error(err.response.data.message);
      dispatch({
        type: CREATE_ACCOMMODATION_FAILED,
        payload: err.response.data,
      });
    }
  };
/* istanbul ignore next */
export const updateAccommodationAction = (acc_id, data) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ACCOMMODATION_PENDING });
    const res = await axiosInstance.put(`/accommodations/${acc_id}`, data);
    dispatch({
      type: UPDATE_ACCOMMODATION_SUCCESS,
      payload: res.data,
      error: null,
    });
    toast.success(res.data.message);
  } catch (error) {
    toast.error(error.response.data.message);
    dispatch({
      type: UPDATE_ACCOMMODATION_FAILED,
      payload: error.response.data,
    });
  }
};
/* istanbul ignore next */
export const deleteAccommodationAction = (acc_id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ACCOMMODATION_PENDING });
    const res = await axiosInstance.delete(`/accommodations/${acc_id}`);
    dispatch({
      type: DELETE_ACCOMMODATION_SUCCESS,
      payload: res.data,
      pending: false,
      error: null,
    });
    toast.success(res.data.message);
  } catch (err) {
    toast.error(err.response.data.message);
    dispatch({
      type: DELETE_ACCOMMODATION_FAILED,
      pending: false,
      payload: err.response.data,
    });
  }
};
/* istanbul ignore next */
export const filterAccommodationsAction =
  (accommodations) => async (dispatch) => {
    try {
      dispatch({
        type: FILTER_ACCOMMODATION,
        payload: accommodations,
        pending: false,
        error: null,
      });
    } catch (err) {
      dispatch({
        type: FETCH_ACCOMMODATIONS_FAILED,
        pending: false,
        payload: err.response ? err.response.data : err,
      });
    }
  };

/* istanbul ignore next */
export const fetchComments =
  (accommodationId, pages, limit) => async (dispatch) => {
    try {
      const res = await await axios(
        `/accommodations/${accommodationId}/comment/?pages=${pages}&limit=${limit}`,
        { method: 'GET' },
      );
      await dispatch({
        type: `${FETCH_COMMENTS}_SUCCESS`,
        payload: res.data,
      });
    } catch (err) {
      await dispatch({
        type: `${FETCH_COMMENTS}_FAILED`,
        payload: err.response.data,
      });
    }
  };

/* istanbul ignore next */
export const createFeedback =
  (accommodationId, comment) => async (dispatch) => {
    try {
      await dispatch({
        type: `${CREATE_COMMENTS}_PENDING`,
      });
      const res = await axios(`/accommodations/${accommodationId}/comment`, {
        method: 'POST',
        data: { comment },
      });
      await dispatch({
        type: `${CREATE_COMMENTS}_SUCCESS`,
        payload: res.data,
      });
      toast.success(res.data.message);
    } catch (err) {
      await dispatch({
        type: `${CREATE_COMMENTS}_FAILED`,
        payload: err.response.data,
      });
      toast.error(err.response.data.message);
    }
  };

/* istanbul ignore next */
export const updateComments =
  (accommodationId, commentId, comment) => async (dispatch) => {
    try {
      const res = await axios(
        `/accommodations/${accommodationId}/comment/${commentId}`,
        { method: 'PUT', data: { comment } },
      );
      await dispatch({
        type: `${UPDATE_COMMENTS}_SUCCESS`,
        payload: { commentId, res, comment },
      });
      toast.success(res.data?.message);
    } catch (err) {
      await dispatch({
        type: `${UPDATE_COMMENTS}_FAILED`,
      });
      toast.error(err.response.data.message);
    }
  };

/* istanbul ignore next */
export const deleteComment =
  (accommodationId, commentId) => async (dispatch) => {
    try {
      const res = await axios(
        `/accommodations/${accommodationId}/comment/${commentId}`,
        { method: 'DELETE' },
      );
      await dispatch({
        type: `${DELETE_COMMENTS}_SUCCESS`,
        payload: { commentId, res },
      });
      toast.success(res.data.message);
    } catch (err) {
      await dispatch({
        type: `${DELETE_COMMENTS}_FAILED`,
        payload: err.response.data,
      });
      toast.error(err.response.data.message);
    }
  };

/* istanbul ignore next */
export const likeAccommodationAction =
  (accommodationId) => async (dispatch) => {
    try {
      const res = await axiosInstance.post(
        `/accommodations/${accommodationId}/like`,
      );
      await dispatch({
        type: LIKE_ACCOMMODATION,
        payload: { accommodationId, res },
      });
      toast.success(res.data.data.messaage);
    } catch (error) {
      await dispatch({
        type: LIKE_ACCOMMODATION_FAILED,
      });
      toast.error(error.response.message);
    }
  };
