import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { useSignUpMutation } from "../../api/auth";
import { setUser } from "../../api/authSlice";
import { useTranslation } from "react-i18next";

export default function SignUp() {
  const { t } = useTranslation();
  const [signUp] = useSignUpMutation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signUp({
        username,
        email,
        password1,
        password2,
      }).unwrap();
      if (data.msg === "OK") {
        const userid = data.user_id;
        const accessToken = data.access_token;
        dispatch(setUser({ username, userid, accessToken }));
        navigate(from, { replace: true });
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} component={RouterLink} to={"/"}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {t("Sign up")}
      </Typography>
      <Box component="form" noValidate sx={{ mt: 3, maxWidth: 400 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              autoComplete="username"
              name="username"
              required
              fullWidth
              id="username"
              label={t("user name")}
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
              label={t("email address")}
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
              label={t("password1")}
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
              label={t("password2")}
              type="password"
              id="password2"
              autoComplete="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Grid>
          {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
        </Grid>
        <Typography variant="subtitle1" sx={{ color: theme.palette.error.main }} gutterBottom>
          {error ? error : ""}
        </Typography>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>
          {t("Sign up")}
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link to={"/signin"} variant="body2" component={RouterLink}>
              {t("Already have an account? Sign in")}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
