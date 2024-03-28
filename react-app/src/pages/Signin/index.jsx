import React, { useState } from "react"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControlLabel from "@mui/material/FormControlLabel"
import Grid from "@mui/material/Grid"
import Link from "@mui/material/Link"
import { useTheme } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"

import { useSignIn } from "../../api/auth"
import { useAuthStore } from "../../store"

export default function SignIn() {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { username: "admin", password: "admin123" } })

  const [error, setError] = useState("")
  const theme = useTheme()
  const setUser = useAuthStore((state) => state.setUser)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"
  const { trigger: signIn } = useSignIn()

  const onSubmit = async (arg) => {
    try {
      const response = await signIn(arg)
      if (response.msg === "OK") {
        const {
          username,
          user_id: userid,
          access_token: accessToken,
          refresh_token: refreshToken,
        } = response
        setUser({ username, userid, accessToken, refreshToken })
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
        flexGrow: 1,
        flexDirection: "column",
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
        {t("Sign in")}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1, maxWidth: 400 }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label={t("user name")}
          name="username"
          autoComplete="username"
          autoFocus
          error={!!errors.username}
          {...register("username", {
            required: true,
            minLength: {
              value: 4,
              message: t("minLength error", { name: t("username"), length: 4 }),
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
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label={t("password")}
          type="password"
          id="password"
          autoComplete="password"
          error={!!errors.password}
          {...register("password", {
            required: true,
            minLength: {
              value: 6,
              message: t("minLength error", { name: t("username"), length: 6 }),
            },
            maxLength: {
              value: 20,
              message: t("maxLength error", {
                name: t("username"),
                length: 20,
              }),
            },
          })}
          helperText={!!errors.password && errors.password.message}
        />
        <FormControlLabel
          control={<Checkbox color="primary" {...register("remember")} />}
          label={t("Remember me")}
        />
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
          {t("Sign in")}
        </Button>
        <Grid container>
          <Grid item>
            <Link to={"/signup"} variant="body2" component={RouterLink}>
              {t("Don't have an account? Sign Up")}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
