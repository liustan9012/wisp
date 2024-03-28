import * as React from "react"
import Button from "@mui/material/Button"
// import Box from '@mui/material/Box';
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from "@mui/material/DialogTitle"
import { useTheme } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTranslation } from "react-i18next"

import { useCreateTag } from "../../api/tag"
import { useTagStore } from "../../store"

export default function FormDialog() {
  const theme = useTheme()
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const matches = useMediaQuery(theme.breakpoints.up("sm"))
  const [name, setName] = React.useState("")
  const [error, setError] = React.useState(null)
  const newTag = useTagStore((state) => state.newTag)
  const { trigger: createTag } = useCreateTag()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleNewTag = async () => {
    try {
      const data = await createTag({ name })
      if (data?.msg === "OK") {
        newTag(data.tag)
        setOpen(false)
      } else {
        setError(data.error)
      }
    } catch (error) {
      console.error(error)
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} fullWidth>
        {t("create tag")}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { minWidth: matches ? 400 : "80%" } }}
      >
        <DialogTitle>{t("create tag")}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText> */}
          <TextField
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="dense"
            id="tag-name"
            label={t("name")}
            fullWidth
            variant="standard"
            error={!!error}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button onClick={handleNewTag}>{t("create")}</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
