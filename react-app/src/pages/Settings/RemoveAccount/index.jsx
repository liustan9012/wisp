import React, { useState } from "react";
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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useDeleteUserMutation } from "../../../api/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentAuth, unsetUser } from "../../../api/authSlice";

export default function RemoveAccount() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState();
  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(selectCurrentAuth);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteUser = async () => {
    const data = await deleteUser({ userid: auth.userid }).unwrap();
    if (data.msg === "OK") {
      dispatch(unsetUser());
      setOpen(false);
      navigate("/");
    } else {
      setError(data.error);
    }
  };
  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={"row"} spacing={2} sx={{ mb: 1, alignItems: "center" }}>
        <PersonRemoveIcon color={"primary"} />
        <Typography component="h1" variant="h6" sx={{ textTransform: "capitalize" }}>
          {t("Remove Account")}
        </Typography>
      </Stack>
      <Divider />
      <Typography sx={{ mt: 2 }}>{t("Remove Account")}</Typography>
      <Stack direction={"row-reverse"} sx={{ mt: 2 }}>
        <Button onClick={handleOpen}>{t("Remove Account")}</Button>
        <Dialog open={open} onClose={handleClose} fullWidth PaperProps={{ sx: { p: 4 } }}>
          <DialogTitle>{t("Remove Account")}</DialogTitle>
          <DialogContent>
            <Typography>{t("Confirm Delete Account")}</Typography>
            <Typography>{error}</Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="warning" onClick={handleDeleteUser}>
              {t("confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}
