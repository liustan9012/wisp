import { useRef, useState } from "react"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined"
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useTranslation } from "react-i18next"

import { useDownloadNavlink } from "../../../api/data"
import { useTagStore } from "../../../store"
import TagsSelect from "../../Componets/TagsSelect"

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
})

const PUBLISHED = "PUBLISHED"
const PRIVATE = "PRIVATE"
const ALL = "ALL"

const ExportNavlink = () => {
  const { t } = useTranslation()
  const [uploadFile, setUploadFile] = useState(null)
  const [open, setOpen] = useState(false)
  const [navlinkStatus, setNavlinkStatus] = useState(ALL)
  const selectTags = useTagStore((state) => state.selectTags)
  const { trigger: downloadNavlink } = useDownloadNavlink()

  const handleImport = async () => {
    const status = navlinkStatus === ALL ? null : navlinkStatus
    const response = await downloadNavlink({ tags: selectTags, status })
    const blobData = new Blob([response], {
      type: "application/html",
    })
    const blobUrl = URL.createObjectURL(blobData)

    const downloadLink = document.createElement("a")
    downloadLink.href = blobUrl
    downloadLink.download = "navlinks.html"

    document.body.appendChild(downloadLink)
    downloadLink.click()

    URL.revokeObjectURL(blobUrl)
    document.body.removeChild(downloadLink)
  }

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction={"row"} spacing={2} sx={{ mb: 1, alignItems: "center" }}>
        <FileDownloadOutlinedIcon color={"primary"} />
        <Typography
          component="h1"
          variant="h6"
          sx={{ textTransform: "capitalize" }}
        >
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
  )
}

export default ExportNavlink
