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
import { useDownloadNavlinkMutation } from "../../../api/data";
import TagsSelect from "../../Componets/TagsSelect";
import { useSelector } from "react-redux";
import { selectCurrentAuth } from "../../../api/authSlice";
import { selectCurrentTag } from "../../Componets/tagSlice";

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
const ALL = "ALL";

const ExportNavlink = () => {
  const { t } = useTranslation();
  const [uploadFile, setUploadFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [navlinkStatus, setNavlinkStatus] = useState(ALL);
  const auth = useSelector(selectCurrentAuth);
  const tag = useSelector(selectCurrentTag);
  const [downloadNavlink, result] = useDownloadNavlinkMutation();

  const handleImport = async () => {
    let token = auth.accessToken;

    const headers = new Headers();
    headers.set("authorization", `Bearer ${token}`);
    console.log(tag.selectTags, navlinkStatus);
    const status = navlinkStatus === ALL ? null : navlinkStatus;
    const response = await downloadNavlink({ tags: tag.selectTags, status }).unwrap();
    const blobData = new Blob([response], {
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
        <Typography> {t("export conditions")}</Typography>
        <Stack sx={{ mt: 2 }} spacing={2}>
          <Typography sx={{ width: 80 }}> {t("tag")}</Typography>
          <TagsSelect sx={{ width: 300 }} />
        </Stack>
        <Stack sx={{ mt: 2, maxWidth: 300 }} spacing={2}>
          <Typography sx={{ width: 80 }}>{t("status")}</Typography>
          <Select
            labelId="select-status-label"
            id="select-status"
            value={navlinkStatus}
            sx={{ minWidth: 240 }}
            onChange={(e) => setNavlinkStatus(e.target.value)}
            size="small"
          >
            <MenuItem value={ALL}>{t("all")}</MenuItem>
            <MenuItem value={PUBLISHED}>{t("published")}</MenuItem>
            <MenuItem value={PRIVATE}>{t("private")}</MenuItem>
          </Select>
        </Stack>
        <Button variant="contained" onClick={handleImport} sx={{ mt: 2 }}>
          {t("export")}
        </Button>
      </Box>
    </Box>
  );
};

export default ExportNavlink;
