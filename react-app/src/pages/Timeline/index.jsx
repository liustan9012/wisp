import React from "react";
import { Typography, Stack, Paper, Link, Divider, } from "@mui/material";
import { Link as RouterLink, } from "react-router-dom";
import { useGetPostListQuery } from '../../api/post'
import { timeConverter } from '../../utils/datetime'

export default function TimeLine() {
  const { data, isLoading, } = useGetPostListQuery()
  if (isLoading) return <Typography>Loading...</Typography>
  if (!data || data?.msg === 'error') return <Typography>Missing post!</Typography>
  const { posts } = data
  return (
    <Paper elevation={0} sx={{ mt: 8 }}>
      {posts.map((post) => (
        <Stack
          key={post.id}
          direction={'row'}
          spacing={1}
          useFlexGap
          divider={<Divider orientation="vertical" flexItem />}
          sx={{ minHeight: '3rem', justifyContent: "flex-start" }}
        >
          <Typography sx={{ width: 100 }} >{timeConverter(post.created_at).slice(0, 10)}</Typography>
          <Link to={`/post/${post.id}`} component={RouterLink} underline="none">{post.title}</Link>
        </Stack>
      ))
      }
    </Paper >
  )
}