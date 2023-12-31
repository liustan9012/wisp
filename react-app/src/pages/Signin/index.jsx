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

import { setUser } from "../../api/authSlice";
import { useSignInMutation } from "../../api/auth";
import { useTranslation } from "react-i18next";
import { INITUSER } from "../../utils/init";

export default function SignIn() {
  const { t } = useTranslation();
  const [username, setUsername] = useState(INITUSER.username);
  const [password, setPassword] = useState(INITUSER.password);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [signIn] = useSignInMutation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await signIn({ username, password, remember }).unwrap();
      if (data.msg === "OK") {
        const userid = data.user_id;
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        dispatch(setUser({ username, userid, accessToken, refreshToken }));
        setPassword("");
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
        flexGrow: 1,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} component={RouterLink} to={"/"}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {t("Sign in")}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, maxWidth: 400 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label={t("user name")}
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label={t("password")}
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={<Checkbox checked={remember} color="primary" onChange={(e) => setRemember(e.target.checked)} />}
          label={t("Remember me")}
        />
        <Typography variant="subtitle1" sx={{ color: theme.palette.error.main }} gutterBottom>
          {error ? error : ""}
        </Typography>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleSubmit}>
          {t("Sign in")}
        </Button>
        <Grid container>
          <Grid item xs>
            {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
          </Grid>
          <Grid item>
            <Link to={"/signup"} variant="body2" component={RouterLink}>
              {t("Don't have an account? Sign Up")}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
