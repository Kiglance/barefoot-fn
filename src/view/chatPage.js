import React, { useEffect, useState, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Paper, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { MessageLeft, MessageRight } from '../components/chat/messages';
import { TextInput } from '../components/chat/textField';
import { OnlineNotify, UserNotify } from '../components/chat/notification';
import {
  chatLeave,
  receiveMessage,
  recieveMessageError,
  sendMessage,
  socketConnecting,
} from '../redux/actions/chat.action';
import store from '../redux/store';
import { socketContext } from '../helpers/context';

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      width: '100%',
      height: '80vh',
      maxWidth: '1000px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: '#F2F2F2',
    },
    paper2: {
      width: '80vw',
      maxWidth: '500px',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      position: 'relative',
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    },
    messagesBody: {
      width: 'calc( 100% - 20px )',
      margin: 10,
      overflowY: 'scroll',
      height: 'calc( 100% - 80px )',
      backgroundColor: '#F2F2F2',
    },
  }),
);

const ChatPage = () => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const [notify, setNotify] = useState('');
  const [receivedMessage, setRecievedMessage] = useState([]);
  const [userJoined, setUserJoined] = useState([]);
  const [userLeaving, setUserLeaving] = useState([]);
  const socket = useContext(socketContext);
  const messagesEndRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const send = async (e) => {
    e.preventDefault();
    if (message.trim() !== '') {
      socket.emit('message:send', { message });
    }
    setMessage('');
  };
  useEffect(() => {
    socket.emit(
      'user:joining',
      JSON.parse(localStorage.getItem('userCredentials')),
    );
    socket.emit('online', {});
  }, []);

  useEffect(() => {
    socket.on('user:online', (data) => {
      localStorage.setItem('allMessages', JSON.stringify(data));
      store.dispatch(receiveMessage(data));
      const { chatReducer } = store.getState();
      setRecievedMessage((innerReceivedMessage) => [
        ...innerReceivedMessage,
        ...chatReducer.allMessages.messages,
      ]);
      setLoading(false);
    });

    socket.on('user:joined', (data) => {
      setUserJoined([...userJoined, data.data]);
      setNotify(data.users);
    });

    socket.on('message:recieve', async (data) => {
      await store.dispatch(sendMessage(data.message));
      const { chatReducer } = store.getState();
      setRecievedMessage((receivedMessage) => [
        ...receivedMessage,
        chatReducer.sendMessage,
      ]);
    });

    socket.on('user:disconnected', (data) => {
      setUserLeaving(data.user);
      setNotify(data.usersLeft);
      localStorage.setItem('socket', JSON.stringify(data));
    });
  }, []);

  useEffect(scrollToBottom, [receivedMessage]);

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <Paper id="style-1" className={classes.messagesBody} elevation={0}>
          {loading ? (
            <Box sx={{ width: '100%' }}>
              <CircularProgress
                size="80px"
                sx={{
                  margin: '50%',
                }}
              />
            </Box>
          ) : (
            <>
              <OnlineNotify message={`${notify} users online`} />
              {userJoined.map((user, index) => (
                <UserNotify
                  user={`${user.first_name} ${user.last_name} has joined the chat`}
                  key={index}
                />
              ))}

              {userLeaving.map((user, index) => (
                <OnlineNotify
                  message={`${user.firstName} ${user.lastName} has left the chat`}
                  key={index}
                />
              ))}

              <MessageLeft
                message="Welcome to this Barefoot Nomad application!!!!!"
                timestamp=""
                photoURL=""
                displayName="Barefoot Nomad Bot"
                avatarDisp={false}
              />
              {receivedMessage.map((message, index) =>
                message.User?.first_name ===
                JSON.parse(localStorage.getItem('userCredentials'))
                  ?.first_name ? (
                  <MessageRight
                    message={message.message}
                    timestamp={`${new Date(
                      message.createdAt,
                    ).getHours()}:${new Date(message.createdAt).getMinutes()}`}
                    photoURL=""
                    displayName={message.User.first_name}
                    avatarDisp={false}
                    key={index}
                  />
                ) : (
                  <MessageLeft
                    message={message.message}
                    timestamp={`${new Date(
                      message.createdAt,
                    ).getHours()}:${new Date(message.createdAt).getMinutes()}`}
                    photoURL=""
                    displayName={message.User.first_name}
                    avatarDisp={false}
                    key={index}
                  />
                ),
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </Paper>
        <TextInput send={send} setMessage={setMessage} />
      </Paper>
    </div>
  );
};

export default ChatPage;
