import React, { useEffect, useState } from 'react';
import { Box, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch } from 'react-redux';
import { fetchNotifications } from '../../redux/actions/notifications.action';
import NotificationModal from '../../components/NotificationModal';

const Notification = ({ notifications, unread }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchNotifications(1, 10));
  }, []);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Box>
      <Badge badgeContent={unread} color="error" sx={{ color: '#FFC800' }}>
        <NotificationsIcon onClick={handleOpen} sx={{ position: 'relative' }} />
      </Badge>
      <NotificationModal handleClose={handleClose} open={open} />
    </Box>
  );
};
export default Notification;
