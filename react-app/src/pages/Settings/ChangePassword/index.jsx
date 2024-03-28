import React, { useState } from "react"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { Divider, Stack } from "@mui/material"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import { useTheme } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { useChangePassword } from "../../../api/auth"

export default function ChangePassword() {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()
  const password1 = watch("password1", "")
  // const [username, setUsername] = useState("")
  // const [password1, setPassword1] = useState("")
  // const [password2, setPassword2] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const theme = useTheme()
  const { trigger: changePassword } = useChangePassword()

  const onSubmit = async (data) => {
    try {
      const response = await changePassword({ ...data })
      if (response.msg === "OK") {
        const userid = response.user_id
        navigate("/signin")
      } else {
        setError(response.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={"row"} spacing={2} sx={{ mb: 1, alignItems: "center" }}>
        <LockOutlinedIcon color={"primary"} />
        <Typography
          component="h1"
          variant="h5"
          sx={{ textTransform: "capitalize" }}
        >
          {t("change password")}
        </Typography>
      </Stack>
      <Divider />
      <Box component="form" noValidate sx={{ mt: 2 }}>
        <Grid container spacing={1} sx={{ maxWidth: 500 }}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              size="small"
              name="username"
              id="username"
              label={t("user name")}
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
              size="small"
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
              size="small"
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
          <Grid item xs={12}>
            <Typography
              variant="subtitle1"
              sx={{ color: theme.palette.error.main }}
              gutterBottom
            >
              {error ? error : ""}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmit(onSubmit)}
            >
              {t("change password")}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
