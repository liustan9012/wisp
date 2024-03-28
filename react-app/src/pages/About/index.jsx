import React from "react"
import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

import { usePost } from "../../api/post"
import { useAuthStore } from "../../store"
import { MarkdownPreview } from "../Componets/MDEditor"

export default function About() {
  const { t } = useTranslation()

  const auth = useAuthStore((state) => state.auth)
  const { data, isError, isLoading } = usePost("about")
  if (isLoading)
    return <Typography sx={{ mb: 4, mt: 4 }}>{t("Loading...")}</Typography>
  const { post, msg } = data
  if (msg === "error")
    return <Typography sx={{ mb: 4, mt: 4 }}>{t("about")}</Typography>
  return (
    <Box sx={{ mt: 4 }}>
      <MarkdownPreview source={post.content} />
    </Box>
  )
}
