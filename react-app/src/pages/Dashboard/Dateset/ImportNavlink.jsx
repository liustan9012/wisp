import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import { useUploadNavlinkMutation } from "../../../api/data";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const PUBLISHED = "PUBLISHED";
const PRIVATE = "PRIVATE";
const DELETE = "DELETE";

const ImportNavlink = () => {
  const { t } = useTranslation();
  const [uploadFile, setUploadFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [navlinkStatus, setNavlinkStatus] = useState(PRIVATE);
  const [uploadNavlink, { data, isLoading, isSuccess, isError }] = useUploadNavlinkMutation();
  const handleChangeFile = (e) => {
    setUploadFile(e.target.files[0]);
  };
  const handleImport = async () => {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("status", navlinkStatus);
    await uploadNavlink({ formData });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={"row"} spacing={2} sx={{ mb: 1, alignItems: "center" }}>
        <FileUploadIcon color={"primary"} />
        <Typography component="h1" variant="h6" sx={{ textTransform: "capitalize" }}>
          {t("import navlink")}
        </Typography>
      </Stack>
      <Divider />
      <Box sx={{ mt: 2 }}>
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt: 2, alignItems: "center" }} spacing={2}>
          <Typography sx={{ width: 80 }}> {t("bookmarks file")}</Typography>
          <TextField value={uploadFile?.name || ""} disabled size="small" sx={{ minWidth: 240 }}></TextField>
          <Button component="label" startIcon={<CloudUploadIcon />}>
            <VisuallyHiddenInput type="file" accept=".html" onChange={handleChangeFile} />
          </Button>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ mt: 2, alignItems: "center" }} spacing={2}>
          <Typography sx={{ width: 80 }}>{t("status")}</Typography>
          <Select
            labelId="select-status-label"
            id="select-status"
            value={navlinkStatus || PRIVATE}
            sx={{ minWidth: 240 }}
            onChange={(e) => setNavlinkStatus(e.target.value)}
            size="small"
          >
            <MenuItem value={PUBLISHED}>{t("published")}</MenuItem>
            <MenuItem value={PRIVATE}>{t("private")}</MenuItem>
          </Select>
        </Stack>
        <Button
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading && <CircularProgress size={24} />}
          onClick={handleImport}
          sx={{ mt: 2 }}
        >
          {t("import")}
        </Button>
        <Dialog open={open} onClose={handleClose} maxWidth={"xs"} fullWidth>
          <DialogTitle id="import-navlink-dialog-title">{t("import navlink")}</DialogTitle>
          <DialogContent>
            <DialogContentText id="import-navlink-dialog-description">
              {data && data?.msg === "OK" ? `success: ${data?.count?.success} failure: ${data?.count?.failure}` : ""}
              {data && data?.msg === "error" ? `error: ${data?.error}` : ""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {t("confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ImportNavlink;
