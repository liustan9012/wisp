import { Box, Button, Card, IconButton, Paper, Stack, Toolbar, Typography } from "@mui/material";
import ChangePassword from "./ChangePassword";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTranslation } from "react-i18next";
import RemoveAccount from "./RemoveAccount";
import { useNavigate } from "react-router-dom";
export default function Settings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Toolbar />
      <Stack direction={"row"} sx={{ pl: 4, pr: 4 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {t("Settings")}
        </Typography>
        <Button color="primary" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ flexGrow: 0 }}>
          {t("go back")}
        </Button>
      </Stack>
      <Stack spacing={2}>
        <ChangePassword />
        <RemoveAccount />
      </Stack>
    </>
  );
}
