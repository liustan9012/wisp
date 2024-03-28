import React, { lazy, Suspense } from "react"
import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Link as RouterLink, useParams } from "react-router-dom"

import { usePost } from "../../api/post"
import { timeConverter } from "../../utils/datetime"
import { MarkdownPreview } from "../Componets/MDEditor"
import CommentList from "./Comments"

export default function Post() {
  const { t } = useTranslation()
  const { postId } = useParams()
  const { data, isLoading, mutate } = usePost(postId)
  if (isLoading) return <Typography>{t("Loading...")}</Typography>
  if (!data || data?.msg === "error")
    return <Typography>{t("Missing post!")}</Typography>
  const handleComment = () => {
    mutate()
  }
  const { post, tags, comments } = data
  return (
    <Paper elevation={0} sx={{ mt: 2 }}>
      <Typography variant="h4"> {post.title} </Typography>
      <Stack
        direction={"row"}
        sx={{ mt: 1, mb: 1 }}
        spacing={1}
        divider={<Divider orientation="vertical" flexItem />}
      >
        <Typography>{timeConverter(post.created_at)} </Typography>
        {tags.length ? (
          <>
            {tags.map((t) => (
              <Chip
                key={t.id}
                to={`/tag/${t.id}`}
                component={RouterLink}
                underline="none"
                label={t.name}
                clickable
                size="small"
              ></Chip>
            ))}
          </>
        ) : null}
      </Stack>
      <Box sx={{ mb: 4 }}>
        <MarkdownPreview source={post.content} />
      </Box>
      {post.enable_comment === 1 ? (
        <CommentList comments={comments} handleComment={handleComment} />
      ) : (
        <Typography>{t("no comments yet")}</Typography>
      )}
    </Paper>
  )
}
