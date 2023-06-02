import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from "@mui/material/styles";
import React, { useState, } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import { useSignUpMutation } from '../../api/auth';
import { setUser } from '../../api/authSlice';
import Footer from '../Footer';


export default function SignUp() {
  const [signUp,] = useSignUpMutation()
  const [username, setUsername] = useState("admin")
  const [email, setEmail] = useState("admin@admin.com")
  const [password1, setPassword1] = useState("admin123")
  const [password2, setPassword2] = useState("admin123")
  const [error, setError] = useState("admin@admin.com")
  const dispatch = useDispatch()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  const navigate = useNavigate()
  const theme = useTheme()


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await signUp({ username, email, password1, password2 }).unwrap();
      if (data.msg === "OK") {
        const userid = data.user_id
        const accessToken = data.access_token
        dispatch(setUser({ username, userid, accessToken }))
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
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} component={RouterLink} to={"/"}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password2"
                label="Password2"
                type="password"
                id="password2"
                autoComplete="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)} />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Typography variant="subtitle1" sx={{ color: theme.palette.error.main }} gutterBottom>
            {error ? error : ""}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to={"/signin"} variant="body2" component={RouterLink}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Footer sx={{ mt: 5 }} />
    </Container>
  );
}