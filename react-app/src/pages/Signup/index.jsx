import React, { useState } from "react"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import Container from "@mui/material/Container"
import CssBaseline from "@mui/material/CssBaseline"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid"
import Link from "@mui/material/Link"
import { useTheme } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"

import { useSignUp } from "../../api/auth"
import { useAuthStore } from "../../store"

export default function SignUp() {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const password1 = watch("password1", "")
  const [error, setError] = useState("")
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  const navigate = useNavigate()
  const theme = useTheme()

  const setUser = useAuthStore((state) => state.setUser)
  const { trigger: signUp } = useSignUp()

  const onSubmit = async (data) => {
    try {
      const response = await signUp({ ...data })
      if (response.msg === "OK") {
        const username = response.username
        const userid = response.user_id
        const accessToken = response.access_token
        setUser({ username, userid, accessToken })
        navigate(from, { replace: true })
      } else {
        setError(response.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

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
      <Avatar
        sx={{ m: 1, bgcolor: "secondary.main" }}
        component={RouterLink}
        to={"/"}
      >
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        {t("Sign up")}
      </Typography>
      <Box component="form" noValidate sx={{ mt: 3, maxWidth: 400 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="username"
              required
              fullWidth
              id="username"
              label={t("user name")}
              autoFocus
              autoComplete="username"
              error={!!errors.username}
              {...register("username", {
                required: true,
                minLength: {
                  value: 4,
                  message: t("minLength error", {
                    name: t("username"),
                    length: 4,
                  }),
                },
                maxLength: {
                  value: 20,
                  message: t("maxLength error", {
                    name: t("username"),
                    length: 20,
                  }),
                },
              })}
              helperText={!!errors.username && errors.username.message}
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
              error={!!errors.email}
              {...register("email", {
                required: true,
                maxLength: {
                  value: 30,
                  message: "email should be at most 30 characters.",
                },
                pattern: {
                  value:
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: t("email error pattern"),
                },
              })}
              helperText={!!errors.email && errors.email.message}
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
              error={!!errors.password1}
              autoComplete="new-password"
              {...register("password1", {
                required: true,
                minLength: {
                  value: 6,
                  message: t("minLength error", {
                    name: t("password"),
                    length: 6,
                  }),
                },
                maxLength: {
                  value: 20,
                  message: t("maxLength error", {
                    name: t("password"),
                    length: 20,
                  }),
                },
              })}
              helperText={!!errors.password1 && errors.password1.message}
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
              autoComplete="new-password"
              error={!!errors.password2}
              {...register("password2", {
                required: true,
                validate: (value) =>
                  value === password1 || t("password error match"),
              })}
              helperText={!!errors.password2 && errors.password2.message}
            />
          </Grid>
        </Grid>
        <Typography
          variant="subtitle1"
          sx={{ color: theme.palette.error.main }}
          gutterBottom
        >
          {error ? error : ""}
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit(onSubmit)}
        >
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
  )
}
