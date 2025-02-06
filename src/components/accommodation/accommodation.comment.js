/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchComments,
  createFeedback,
  updateComments,
} from '../../redux/actions/accommodation.action';
import InputField from '../input';
import Buttons from '../button';
import PositionedMenu from '../menu/menu';

const AccommodationComments = ({ accommodationState }) => {
  const [commentId, setCommentId] = useState(null);
  const [createComment, setCreateComment] = useState('');
  const [updateComment, setUpdateComment] = useState('');
  const [activeComment, setActiveComment] = useState(null);
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const [checked, setChecked] = React.useState(false);

  const { data } = useSelector((state) => state.accommodationComments.comments);
  const { pending, loading } = useSelector(
    (state) => state.accommodationComments,
  );
  const handleChange = () => {
    setChecked((prev) => !prev);
  };
  const { id } = useParams();
  const accommodationId = id;
  useEffect(() => {
    dispatch(fetchComments(accommodationId, 1, 10));
  }, [accommodationId]);
  const isEditing =
    activeComment &&
    activeComment.id === commentId &&
    activeComment.type === 'editing';

  const onChange = (e) => {
    setUpdateComment(e.target.value);
  };
  const handleEditComment = (comment, id) => {
    setCommentId(id);
    setUpdateComment(comment);
    setEdit((prev) => !prev);
  };
  const handleSubmit = () => {
    setCreateComment('');
    dispatch(createFeedback(accommodationId, createComment));
  };

  const handleUpdate = () => {
    dispatch(updateComments(accommodationId, commentId, updateComment));
    setCreateComment('');
    setActiveComment(null);
  };

  const handleComments = (e) => {
    setCreateComment(e.target.value);
    setUpdateComment(e.target.value);
  };
  const handleCloseEdit = () => {
    setActiveComment(null);
    setCreateComment('');
  };
  const user = JSON.parse(localStorage.getItem('userCredentials'));
  return (
    <Box sx={{ width: { lg: '100%', md: '80%', sm: '80%', xs: '100%' } }}>
      <Paper
        elevation={0}
        onClick={handleChange}
        onChange={handleChange}
        sx={{
          width: '200px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: '50px',
          padding: '10px',
          marginTop: '20px',
        }}
      >
        <Typography component="h5">Comments</Typography>
        {!checked ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
      </Paper>
      <Paper elevation={0} sx={{ width: '100%', marginTop: '10px' }}>
        <Collapse
          in={!checked}
          sx={{
            width: { lg: '100%', md: '90%' },
          }}
        >
          <Box
            sx={{
              width: { lg: '55%', md: '100%', sm: '100%', xs: '100%' },
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              flexDirection: isEditing
                ? { xs: 'column', sm: 'column', md: 'row' }
                : { xs: 'column', sm: 'column', md: 'row' },
              marginLeft: { lg: 10, xs: 0 },
            }}
          >
            <Paper
              elevation={0}
              sx={{ width: '100%', textAlign: 'center', height: 'none' }}
            >
              <InputField
                name="comments"
                multiline
                label=" Comment"
                value={createComment}
                onChange={handleComments}
                placeholder="enter your comment"
                otherStyles={{
                  width: { xs: '90%', md: '70%' },
                  marginBottom: '20px',
                  height: { xs: 'auto', md: 'auto' },
                }}
                disabled={user.role_id === 2}
              />
            </Paper>

            {isEditing ? (
              <Grid container justifyContent="space-around">
                <Buttons
                  variant="contained"
                  sx={{
                    width: 150,
                    height: 50,
                    backgroundColor: '#00095E',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: '500',
                    fontSize: '16px',
                    color: 'white',
                    marginTop: { xs: '30px', sm: '15px', md: '10px' },
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#00095E',
                    },
                  }}
                  value={
                    pending ? (
                      <CircularProgress
                        sx={{
                          color: 'white',
                        }}
                        size={30}
                        thickness={4}
                      />
                    ) : (
                      'Update'
                    )
                  }
                  disabled={updateComment === ''}
                  onClick={handleUpdate}
                />
                <Buttons
                  variant="contained"
                  sx={{
                    width: 150,
                    height: 50,
                    backgroundColor: '#00095E',
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: '500',
                    fontSize: '16px',
                    color: 'white',
                    marginTop: { xs: '30px', sm: '15px', md: '10px' },
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#00095E',
                    },
                  }}
                  value="cancel"
                  onClick={handleCloseEdit}
                />
              </Grid>
            ) : (
              <Buttons
                variant="contained"
                sx={{
                  width: 150,
                  height: 50,
                  backgroundColor: '#00095E',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: '500',
                  fontSize: '16px',
                  color: 'white',
                  marginTop: { xs: '30px', sm: '15px', md: '10px' },
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#00095E',
                  },
                }}
                value={
                  pending ? (
                    <CircularProgress
                      sx={{
                        color: 'white',
                      }}
                      size={30}
                      thickness={4}
                    />
                  ) : (
                    'Comment'
                  )
                }
                disabled={createComment === ''}
                onClick={handleSubmit}
              />
            )}
          </Box>
          <Paper elevation={0} sx={{ padding: 2 }}>
            {data &&
              data.results?.map((comment) => (
                <>
                  {!edit ? (
                    <Paper
                      elevation={0}
                      sx={{
                        padding: 2,
                        paddingTop: '0px',
                        width: { lg: '50%', xs: '100%' },
                        marginLeft: { lg: 10, xs: 0 },
                      }}
                      key={comment.id}
                    >
                      <Paper
                        elevation={0}
                        fullWidth
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingLeft: '0px',
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{ display: 'flex', paddingRight: '4px' }}
                        >
                          <Typography sx={{ paddingRight: '20px' }}>
                            {!comment.user && user.first_name}{' '}
                            {!comment.user && user.last_name}
                            {comment.user?.first_name} {comment.user?.last_name}
                          </Typography>
                          <Typography sx={{ fontSize: '15px', color: 'gray' }}>
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </Typography>
                        </Paper>
                        <PositionedMenu
                          commentId={comment.id}
                          accommodationId={accommodationId}
                          userId={comment.user_id}
                          handleEditComment={() => {
                            handleEditComment(comment.comment, comment.id);
                            setCreateComment(comment.comment);
                            setEdit((prev) => !prev);
                            setActiveComment({
                              id: comment.id,
                              type: 'editing',
                            });
                          }}
                        />
                      </Paper>
                      <Typography sx={{ paddingLeft: '12px' }} component="div">
                        {comment.comment}
                      </Typography>
                    </Paper>
                  ) : (
                    <Box
                      sx={{
                        width: {
                          lg: '55%',
                          md: '100%',
                          sm: '100%',
                          xs: '100%',
                        },
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        flexDirection: {
                          xs: 'column',
                          sm: 'column',
                          md: 'row',
                        },
                        marginLeft: { lg: 10, xs: 0 },
                      }}
                    >
                      <InputField
                        name="comments"
                        multiline
                        label=" Comment"
                        value={updateComment}
                        onChange={onChange}
                        placeholder="enter your comment"
                        otherStyles={{ width: { xs: '90%', md: '70%' } }}
                      />
                      <Grid
                        container
                        justifyContent="space-around"
                        sx={{ width: '70%' }}
                      >
                        <Buttons
                          variant="contained"
                          sx={{
                            width: 150,
                            height: 50,
                            backgroundColor: '#00095E',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '500',
                            fontSize: '16px',
                            color: 'white',
                            marginTop: { xs: '30px', sm: '15px', md: '10px' },
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: '#00095E',
                            },
                          }}
                          value={
                            pending ? (
                              <CircularProgress
                                sx={{
                                  color: 'white',
                                }}
                                size={30}
                                thickness={4}
                              />
                            ) : (
                              'Update'
                            )
                          }
                          disabled={updateComment === ''}
                          onClick={handleUpdate}
                        />
                        <Buttons
                          variant="contained"
                          sx={{
                            width: 150,
                            height: 50,
                            backgroundColor: '#00095E',
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: '500',
                            fontSize: '16px',
                            color: 'white',
                            marginTop: { xs: '30px', sm: '15px', md: '10px' },
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: '#00095E',
                            },
                          }}
                          value="cancel"
                          onClick={handleCloseEdit}
                        />
                      </Grid>
                    </Box>
                  )}
                </>
              ))}
          </Paper>
        </Collapse>
      </Paper>
    </Box>
  );
};
export default AccommodationComments;
