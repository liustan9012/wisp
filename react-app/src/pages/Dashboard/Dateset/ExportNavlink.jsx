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
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { styled } from "@mui/material/styles";

import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";
import {} from "../../../api/data";
import TagsSelect from "../../Componets/TagsSelect";
import { useSelector } from "react-redux";
import { selectCurrentAuth } from "../../../api/authSlice";

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
const ALL = "ALL";

const ExportNavlink = () => {
  const { t } = useTranslation();
  const [uploadFile, setUploadFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [navlinkStatus, setNavlinkStatus] = useState(ALL);
  const auth = useSelector(selectCurrentAuth);
  //   const [downloadNavlink, { data, isLoading, isSuccess, isError }] = useDownloadNavlinkMutation();
  const handleChangeFile = (e) => {
    setUploadFile(e.target.files[0]);
  };
  const handleImport = async () => {
    let token = auth.accessToken;

    const headers = new Headers();
    headers.set("authorization", `Bearer ${token}`);
    const response = await fetch("/api/navlink/download", { method: "POST", headers: headers });
    const jsonData = await response.text();
    // const blobData = new Blob([JSON.stringify(jsonData, null, 2)], {
    const blobData = new Blob([jsonData], {
      type: "application/html",
    });
    const blobUrl = URL.createObjectURL(blobData);

    const downloadLink = document.createElement("a");
    downloadLink.href = blobUrl;
    downloadLink.download = "navlinks.html";

    document.body.appendChild(downloadLink);
    downloadLink.click();

    URL.revokeObjectURL(blobUrl);
    document.body.removeChild(downloadLink);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={"row"} spacing={2} sx={{ mb: 1, alignItems: "center" }}>
        <FileDownloadOutlinedIcon color={"primary"} />
        <Typography component="h1" variant="h6" sx={{ textTransform: "capitalize" }}>
          {t("export navlink")}
        </Typography>
      </Stack>
      <Divider />
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ width: 80 }}> {t("export conditions")}</Typography>
        <Stack sx={{ mt: 2 }} spacing={2}>
          <Typography sx={{ width: 80 }}> {t("tag")}</Typography>
          <TagsSelect sx={{ width: 300 }} />
          {/* <TextField value={uploadFile?.name || ""} disabled size="small" sx={{ minWidth: 240 }}></TextField> */}
        </Stack>
        <Stack sx={{ mt: 2, maxWidth: 300 }} spacing={2}>
          <Typography sx={{ width: 80 }}>{t("status")}</Typography>
          <Select
            labelId="select-status-label"
            id="select-status"
            value={navlinkStatus || PRIVATE}
            sx={{ minWidth: 240 }}
            onChange={(e) => setNavlinkStatus(e.target.value)}
            size="small"
          >
            <MenuItem value={ALL}>{t("all")}</MenuItem>
            <MenuItem value={PUBLISHED}>{t("published")}</MenuItem>
            <MenuItem value={PRIVATE}>{t("private")}</MenuItem>
            <MenuItem value={DELETE}>{t("delete")}</MenuItem>
          </Select>
        </Stack>
        <Button
          variant="contained"
          //   disabled={isLoading}
          //   startIcon={isLoading && <CircularProgress size={24} />}
          onClick={handleImport}
          sx={{ mt: 2 }}
        >
          {t("export")}
        </Button>
        {/* <Dialog open={open} onClose={handleClose} maxWidth={"xs"} fullWidth>
          <DialogTitle id="export-navlink-dialog-title">{t("import navlink")}</DialogTitle>
          <DialogContent>
            <DialogContentText id="export-navlink-dialog-description">
              {data && data?.msg === "OK" ? `success: ${data?.count?.success} failure: ${data?.count?.failure}` : ""}
              {data && data?.msg === "error" ? `error: ${data?.error}` : ""}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              {t("confirm")}
            </Button>
          </DialogActions>
        </Dialog> */}
      </Box>
    </Box>
  );
};

export default ExportNavlink;
