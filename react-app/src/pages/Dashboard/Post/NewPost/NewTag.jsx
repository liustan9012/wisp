import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
// import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { useNewTagMutation, } from '../../../../api/tag'
import { newTag } from './tagSlice';
import { useDispatch } from 'react-redux';


export default function FormDialog() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const [name, setName] = React.useState('')
  const [error, setError] = React.useState(null)

  const [reqNewtag,] = useNewTagMutation()
  const dispatch = useDispatch()
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleNewTag = async () => {
    try {
      const data = await reqNewtag({ name }).unwrap()
      if (data?.msg === 'OK') {
        dispatch(newTag({ tag: data.tag }))
        setOpen(false);
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error(error);
      setOpen(false);
    }

  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} fullWidth>
        new tag
      </Button>
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { minWidth: matches ? 400 : '80%' } }} >
        <DialogTitle>New Tag</DialogTitle>
        <DialogContent >
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="dense"
            id="tag-name"
            label="name"
            fullWidth
            variant="standard"
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleNewTag}>New</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}