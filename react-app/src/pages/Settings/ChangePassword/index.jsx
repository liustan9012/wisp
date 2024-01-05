import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Divider, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useChangePasswordMutation } from "../../../api/auth";

export default function ChangePassword() {
  const { t } = useTranslation();
  const [changPassword] = useChangePasswordMutation();
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await changPassword({
        username,
        password1,
        password2,
      }).unwrap();
      if (data.msg === "OK") {
        const userid = data.user_id;
        console.log(userid);
        navigate("/signin");
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={"row"} spacing={2} sx={{ mb: 1, alignItems: "center" }}>
        <LockOutlinedIcon color={"primary"} />
        <Typography component="h1" variant="h5" sx={{textTransform: "capitalize" }}>
          {t("chang password")}
        </Typography>
      </Stack>
      <Divider />
      <Box component="form" noValidate sx={{ mt: 2 }}>
        <Grid container spacing={1} sx={{ maxWidth: 500 }}>
          <Grid item xs={12}>
            <TextField
              autoComplete="username"
              name="username"
              required
              fullWidth
              id="username"
              label={t("user name")}
              value={username}
              size={"small"}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password1"
              label={t("new password")}
              type="password"
              id="password1"
              autoComplete="password1"
              value={password1}
              size={"small"}
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
              size={"small"}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ color: theme.palette.error.main }} gutterBottom>
              {error ? error : ""}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" onClick={handleSubmit}>
              {t("chang password")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
