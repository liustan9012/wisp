import { Box, Button, CardContent, CardHeader, Divider, Link, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { Link as RouteLink, useLocation, useParams } from 'react-router-dom'

import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { selectCurrentAuth } from '../../api/authSlice'
import { useNewCommentMutation } from '../../api/comment'
import StringAvatar from '../../componets/StringAvatar'
import { timeConverter } from '../../utils/datetime'


export default function CommentList({ comments }) {
  const comment = useSelector((state) => state.comment)
  const [content, setContent] = useState(comment.newComment || '')
  const { postId } = useParams()
  const location = useLocation()

  const [newComment,] = useNewCommentMutation()


  const auth = useSelector(selectCurrentAuth)

  const handleContent = (e) => {
    setContent(e.target.value)
  }

  const handleReply = async () => {
    await newComment({
      content,
      postId,
    })
    setContent('')
  }
  return (
    <Box>
      <Divider flexItem />
      {
        comments?.length >= 1 ? comments.map((c) =>
          <Box key={c.id}>
            <CardHeader
              sx={{ p: 1 }}
              title={
                <Stack
                  direction={'row'}
                  alignItems="center"
                >
                  <StringAvatar name={c.username} alt={c.username} ></StringAvatar>
                  <Typography variant='h6' sx={{ pl: 1 }}>{c.username} </Typography>
                  <Typography sx={{ ml: 2, pb: 0 }}>{timeConverter(c.created_at)}</Typography>
                </Stack>
              } />
            <CardContent sx={{ p: 0, pl: 2, pb: 1 }}>
              <Typography >{c.content}</Typography>
            </CardContent>
            <Divider flexItem />
          </Box>
        )
          : <Typography sx={{ mb: 1, pt: 1 }}>no comments yet</Typography>
      }
      <TextField
        required
        id="comment"
        label="comment"
        multiline
        fullWidth
        rows={4}
        value={content}
        onChange={handleContent}
        sx={{ mt: 1 }}
      />
      <Stack direction='row'>
        {(!auth.username)
          ?
          <Stack direction={'row'} alignItems="stretch" sx={{ mt: 2 }}>
            <Link to='/signin' state={{ from: location }} underline='none' variant='h6' component={RouteLink} >Signin</Link>
            <Button sx={{ ml: 1 }} variant='outlined' onClick={handleReply} disabled >reply</Button>
          </Stack>
          :
          <Button onClick={handleReply} >reply</Button>
        }

      </Stack>
    </Box>

  )
}

CommentList.propTypes = {
  comments: PropTypes.array
}