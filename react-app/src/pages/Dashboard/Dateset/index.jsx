import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined"
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { useTranslation } from "react-i18next"

import ExportNavlink from "./ExportNavlink"
import ImportNavlink from "./ImportNavlink"

const Dataset = () => {
  const { t } = useTranslation()

  return (
    <Box sx={{ p: 2 }}>
      <ImportNavlink />
      <ExportNavlink />
    </Box>
  )
}

export default Dataset
