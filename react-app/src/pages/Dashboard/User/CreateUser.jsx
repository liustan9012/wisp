import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from "@mui/material/styles";
import React, { useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSignUpMutation } from '../../../api/auth';


export default function CreateUser() {
  const [signUp,] = useSignUpMutation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [error, setError] = useState(null)
  const location = useLocation()
  const from = location.state?.from?.pathname || "/admin/user/list"
  const navigate = useNavigate()
  const theme = useTheme()


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await signUp({ username, email, password1, password2: password1 }).unwrap();
      if (data.msg === "OK") {
        navigate(from, { replace: true })
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error(error)
    }

  };



  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} >
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create User
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}  >
              <TextField
                autoComplete="username"
                name="username"
                required
                fullWidth
                id="username"
                label="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password1"
                label="Password"
                type="password"
                id="password1"
                autoComplete="password1"
                value={password1}
                onChange={(e) => setPassword1(e.target.value)}
              />
            </Grid>
          </Grid>
          <Typography variant="subtitle1" sx={{ color: theme.palette.error.main  }} gutterBottom>
            {error ? error : ""}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Create
          </Button>

        </Box>
      </Box>
    </Container>
  );
}