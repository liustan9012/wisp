import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { useTranslation } from "react-i18next";
import ImportNavlink from "./ImportNavlink";
import ExportNavlink from "./ExportNavlink";

const Dataset = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 2 }}>
      <ImportNavlink />
      <ExportNavlink />
    </Box>
  );
};

export default Dataset;
