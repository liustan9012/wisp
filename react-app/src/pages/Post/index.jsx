import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper, Stack, Chip, Divider, Box } from "@mui/material";
import MDEditor from '@uiw/react-md-editor';

import { useGetPostQuery } from '../../api/post'
import { Link as RouterLink, } from 'react-router-dom';
import { timeConverter } from '../../utils/datetime';
import CommentList from './Comments';
// import { setComments } from './commentsSlice';
// import { useDispatch } from 'react-redux';



export default function Post() {
  const { postId } = useParams()
  const { data, isLoading, } = useGetPostQuery(postId, { refetchOnMountOrArgChange: true })
  if (isLoading) return <Typography>Loading...</Typography>
  if (!data || data?.msg === 'error') return <Typography>Missing post!</Typography>
  const { post, tags, comments } = data
  return (
    <Paper elevation={0} sx={{ mt: 2 }}>
      <Typography variant='h4'> {post.title} </Typography>
      <Stack direction={'row'} sx={{ mt: 1, mb: 1 }} spacing={1} divider={<Divider orientation="vertical" flexItem />}>
        <Typography>{timeConverter(post.created_at)} </Typography>
        {tags.length ?
          <>
            {tags.map((t) => <Chip
              key={t.id}
              to={`/tag/${t.id}`}
              component={RouterLink}
              underline='none'
              label={t.name}
              clickable
              size='small'
            >
            </Chip>
            )}
          </>
          : null}
      </Stack>
      <Box sx={{ mb: 4 }} >
        <MDEditor.Markdown source={post.content} />
      </Box>
      <CommentList comments={comments}/>
    </Paper >
  )
}