import React, { useState } from "react"
import PersonRemoveIcon from "@mui/icons-material/PersonRemove"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { useDeleteUser } from "../../../api/auth"
import { useAuthStore } from "../../../store"

export default function RemoveAccount() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState()
  const navigate = useNavigate()
  const auth = useAuthStore((state) => state.auth)
  const unsetUser = useAuthStore((state) => state.unsetUser)
  const { trigger: deleteUser } = useDeleteUser()
  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  const handleDeleteUser = async () => {
    const data = await deleteUser(auth.userid)
    if (data.msg === "OK") {
      unsetUser()
      setOpen(false)
      navigate("/")
    } else {
      setError(data.error)
    }
  }
  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={"row"} spacing={2} sx={{ mb: 1, alignItems: "center" }}>
        <PersonRemoveIcon color={"primary"} />
        <Typography
          component="h1"
          variant="h6"
          sx={{ textTransform: "capitalize" }}
        >
          {t("Remove Account")}
        </Typography>
      </Stack>
      <Divider />
      <Typography sx={{ mt: 2 }}>{t("Remove Account")}</Typography>
      <Stack direction={"row-reverse"} sx={{ mt: 2 }}>
        <Button onClick={handleOpen}>{t("Remove Account")}</Button>
        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          PaperProps={{ sx: { p: 4 } }}
        >
          <DialogTitle>{t("Remove Account")}</DialogTitle>
          <DialogContent>
            <Typography>{t("Confirm Delete Account")}</Typography>
            <Typography>{error}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="warning"
              onClick={handleDeleteUser}
            >
              {t("confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  )
}
