import React, { useState } from "react"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import { useTheme } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"

import { useSignUp } from "../../../api/auth"

export default function CreateUser() {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [error, setError] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const { trigger: signUp } = useSignUp()

  const onSubmit = async (data) => {
    try {
      const response = await signUp({
        ...data,
        password2: data.password1,
      })
      if (response.msg === "OK") {
        const from = location.state?.from?.pathname || "/admin/user/list"
        navigate(from, { replace: true })
      } else {
        setError(response.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          sx={{ textTransform: "capitalize" }}
        >
          {t("create user")}
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
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
                error={!!errors.username}
                {...register("username", {
                  required: true,
                  minLength: {
                    value: 4,
                    message: t("minLength error", {
                      name: t("user name"),
                      length: 4,
                    }),
                  },
                  maxLength: {
                    value: 20,
                    message: t("maxLength error", {
                      name: t("user name"),
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
                label={t("password")}
                type="password"
                id="password1"
                autoComplete="new-password"
                error={!!errors.password1}
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
            {t("create")}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}
