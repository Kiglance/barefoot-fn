import { makeStyles } from '@material-ui/core/styles';
import { Send } from '@mui/icons-material';
import Buttons from '../button';
import InputField from '../input';

const useStyles = makeStyles((theme) => ({
  wrapForm: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    margin: `${theme.spacing(0)} auto`,
  },
  wrapText: {
    width: '90%',
    margin: '0px 20px 0px 20px',
  },
  button: {
    // margin: theme.spacing(1),
  },
}));

export const TextInput = ({ setMessage, send }) => {
  const classes = useStyles();

  return (
    <>
      <form
        className={classes.wrapForm}
        noValidate
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault();
          send(e);
        }}
      >
        <InputField
          label="Message"
          type="text"
          className={classes.wrapText}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Buttons
          variant="container"
          sx={{
            width: {
              xs: 100,
              sm: 100,
            },
            height: 50,
            margin: {
              xs: '30px 0px',
              sm: '20px 0px',
            },
            backgroundColor: '#00095E',
            fontSize: '18px',
            color: 'white',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#00095E',
            },
          }}
          value={<Send />}
          onClick={send}
        />
      </form>
    </>
  );
};
