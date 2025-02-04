/* eslint-disable no-shadow */
/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-lone-blocks */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Draggable from 'react-draggable';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  deleteBookingAction,
  fetchAllBookingsAction,
  fetchUserBookingsAction,
  updateBookingAction,
} from '../redux/actions/booking.action';
import { TableSkeleton } from '../util/tableSkeleton';
import Error from '../assets/error.svg';
import { searchRoomSchema } from '../validation/room.validations';
import ControlledInputs from '../components/controlledInput';
import { SearchBtn } from '../helpers/signup.helper';
import { BookingModal } from '../components/BookingModal';
import store from '../redux/store';
import { StyledTableCell } from '../assets/styles/tableStyles';

/* istanbul ignore next */
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };
  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
/* istanbul ignore next */
function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
/* istanbul ignore next */
const BookingTable = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [roomId, setRoomId] = React.useState(null);
  const [bookingId, setBookingId] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const pending = useSelector((state) => state.bookingReducer.pending);
  const dispatch = useDispatch();
  const history = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      searchInput: 1,
    },
    resolver: yupResolver(searchRoomSchema),
  });
  useEffect(() => {
    const roleId = JSON.parse(localStorage.getItem('userCredentials'));
    if (roleId?.role_id === 4) {
      dispatch(fetchUserBookingsAction());
    } else dispatch(fetchAllBookingsAction(1));
  }, [page, rowsPerPage, dispatch]);
  const bookings = store.getState().bookingReducer;
  const rows = bookings.booking?.bookings?.rows?.map((booking) => booking);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (roomId, bookingId) => {
    setRoomId(roomId);
    setBookingId(bookingId);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleClickOpen = (roomId, bookingId) => {
    setOpen(true);
    setRoomId(roomId);
    setBookingId(bookingId);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDelete = async () => {
    await store.dispatch(deleteBookingAction(roomId, bookingId));
    setOpen(false);
    if (
      store.getState().bookingReducer?.booking?.message ===
      'booking deleted successfully'
    ) {
      await store.dispatch(fetchUserBookingsAction());
    }
  };
  const handleApprove = async (roomId, bookingId) => {
    const status = { status: 'APPROVED' };
    await store.dispatch(updateBookingAction(roomId, bookingId, status));
    await store.dispatch(fetchAllBookingsAction(roomId));
  };
  const handleReject = (roomId, bookingId) => {
    const status = { status: 'REJECTED' };
    dispatch(updateBookingAction(roomId, bookingId, status));
    dispatch(fetchAllBookingsAction(roomId));
  };

  const searchBookings = async (data) => {
    dispatch(fetchAllBookingsAction(data.searchInput));
  };
  const role = JSON.parse(localStorage.getItem('userCredentials'));
  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {bookings.pending === true && (
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            background: 'transparent',
            top: '100px',
            left: '500px',
            '@media (max-width:476px)': {
              display: 'flex',
              justifyContent: 'center',
              position: 'absolute',
              top: '100px',
              left: '200px',
            },
          }}
        >
          <CircularProgress />
        </Paper>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        data-testid="pending"
      >
        <Typography
          variant="h6"
          sx={{
            color: '#1A2D6D',
            padding: '15px',
            paddingLeft: '30px',
            fontSize: '20px',
          }}
        >
          Bookings
        </Typography>
      </div>
      {role?.role_id === 2 || role?.role_id === 1 ? (
        <Grid container margin={2}>
          <form onSubmit={handleSubmit(searchBookings)}>
            <Grid display="flex">
              <ControlledInputs
                name="searchInput"
                label="Search By Room ID"
                control={control}
                {...(errors?.searchInput && {
                  error: true,
                  helperText: errors.searchInput.message,
                })}
              />
              <div style={{ marginLeft: '5px' }}>
                <SearchBtn variant="contained" type="submit">
                  Search
                </SearchBtn>
              </div>
            </Grid>
          </form>
        </Grid>
      ) : null}
      <TableContainer component={Paper} elevation={0} sx={{ padding: '10px' }}>
        {pending ? (
          <TableSkeleton />
        ) : !pending && rows?.length > 0 ? (
          <Table
            sx={{ minWidth: 650, backgroundColor: '#EBF2FA' }}
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                {role.role_id !== 4 && (
                  <StyledTableCell align="center">User&nbsp;</StyledTableCell>
                )}
                <StyledTableCell align="center">Room No&nbsp;</StyledTableCell>
                <StyledTableCell align="center">
                  Checkin Date&nbsp;
                </StyledTableCell>
                <StyledTableCell align="center">
                  Checkout Date&nbsp;
                </StyledTableCell>
                <StyledTableCell align="center">Status&nbsp;</StyledTableCell>
                <StyledTableCell align="center">Action&nbsp;</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody data-testid="trip-table">
              {rows &&
                rows.map((row) => (
                  /* istanbul ignore next */
                  <TableRow key={row.id} data-testid={`trip-table-${row.id}`}>
                    {role.role_id !== 4 && (
                      <StyledTableCell
                        style={{ width: 160, color: '#1A2D6D' }}
                        align="center"
                        data-testid="trip-cell"
                      >
                        {row.user.first_name} {row.user.last_name}
                      </StyledTableCell>
                    )}
                    <StyledTableCell
                      style={{ width: 160, color: '#1A2D6D' }}
                      align="center"
                    >
                      {row.room_id}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ width: 160, color: '#1A2D6D' }}
                      align="center"
                    >
                      {new Date(row.checkinDate).toDateString()}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{ width: 160, color: '#1A2D6D' }}
                      align="right"
                    >
                      {new Date(row.checkoutDate).toDateString()}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        width: 160,
                        color: `${
                          row.status === 'APPROVED'
                            ? '#018786'
                            : row.status === 'REJECTED'
                            ? '#EC5C5C'
                            : '#FFC800'
                        }`,
                      }}
                      align="center"
                    >
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell
                      style={{
                        width: 160,
                        color: '#1A2D6D',
                      }}
                      align="center"
                    >
                      {role?.role_id === 2 || role?.role_id === 1 ? (
                        <div
                          style={{
                            display: 'flex',
                            width: '100%',
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                          }}
                        >
                          <Button
                            variant="contained"
                            disableElevation
                            disabled={
                              !!(
                                row.status === 'APPROVED' ||
                                row.status === 'REJECTED'
                              )
                            }
                            sx={{
                              backgroundColor:
                                row.status === 'APPROVED' ||
                                row.status === 'REJECTED'
                                  ? '#EC5C5C'
                                  : '#0ABDA0',
                              color: '#fff',
                              width: '50px',
                              fontSize: '10px',
                              '&:hover': {
                                backgroundColor: '#0ABDA0',
                                color: '#fff',
                              },
                            }}
                            onClick={() => handleApprove(row.room_id, row.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ccontained"
                            disabled={
                              !!(
                                row.status === 'APPROVED' ||
                                row.status === 'REJECTED'
                              )
                            }
                            sx={{
                              backgroundColor:
                                row.status === 'REJECTED' ||
                                row.status === 'APPROVED'
                                  ? '#EC5C5C'
                                  : '#E13535',
                              color: '#fff',
                              width: '50px',
                              fontSize: '10px',
                              '&:hover': {
                                backgroundColor: '#EC5C5C',
                                color: '#fff',
                              },
                            }}
                            onClick={() => {
                              handleReject(row.room_id, row.id);
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : role?.role_id === 4 ? (
                        <div
                          className="idIs4"
                          style={{
                            display: 'flex',
                            width: '80%',
                            textAlign: 'center',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            paddingLeft: 21,
                          }}
                        >
                          <p style={{ cursor: 'pointer' }}>
                            <EditIcon
                              sx={{ color: '#1A2D6D' }}
                              onClick={() =>
                                handleOpenModal(row.room_id, row.id)
                              }
                            />
                          </p>
                          <p style={{ cursor: 'pointer' }}>
                            <DeleteIcon
                              sx={{ color: '#EC5C5C' }}
                              onClick={() =>
                                handleClickOpen(row.room_id, row.id)
                              }
                            />
                          </p>
                        </div>
                      ) : null}
                    </StyledTableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 50 * emptyRows }}>
                  <StyledTableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter data-testid="table-footer">
              <TableRow>
                <TablePagination
                  align="right"
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={6}
                  count={bookings?.booking?.bookings?.count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'limit',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '100px',
              padding: '2px',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={Error} alt="error message" width="500px" />
            <Typography variant="body1"> No Bookings Found</Typography>
          </Box>
        )}
      </TableContainer>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Confirm
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <BookingModal
        title="UPDATE BOOKING"
        ids={{ roomId, bookingId }}
        open={openModal}
        handleClose={handleCloseModal}
      />
    </div>
  );
};

export default BookingTable;
