
import React from "react";
import { Typography, Stack, Paper, Link, Divider, } from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useGetTagQuery } from '../../api/tag'
import { timeConverter } from '../../utils/datetime'


export default function TagPage() {
  const { tagId } = useParams()
  const { data, isLoading, } = useGetTagQuery(tagId)

  if (isLoading) return <Typography>Loading...</Typography>
  if (!data || data?.msg === 'error') return <Typography>Missing post!</Typography>
  const { tag } = data
  return (
    <Paper elevation={0} sx={{ mt: 4 }}>
      <Typography variant="h5">{tag.name}</Typography>
      {tag.posts.map((post) => (
        <Stack
          key={post.id}
          direction={'row'}
          spacing={1}
          useFlexGap
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ mt: 2, minHeight: '3rem', justifyContent: "flex-start" }}
        >
          <Typography sx={{ width: 160 }} >{timeConverter(post.created_at)}</Typography>
          <Link to={`/post/${post.id}`} component={RouterLink} underline="none">{post.title}</Link>
        </Stack>
      ))
      }
    </Paper >
  )
}