import { Box, Stack, Typography } from "@mui/material";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import MDEditor from '@uiw/react-md-editor';
import React from "react";
import rehypeSanitize from "rehype-sanitize";

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import { useLocation, useNavigate, useParams, } from "react-router-dom";
import { useGetPostQuery, useNewPostMutation, useUpdatePostMutation } from "../../../../api/post";
import NewTag from './NewTag';
import TagsSelect from './TagsSelect';
import { setPostTags } from "./tagSlice";


function Post({ post }) {
  const postId = post?.id
  const [enableComments, setEnableComments] = React.useState(post?.enable_comments || false)
  const [postStatus, setPostStatus] = React.useState(post?.status === 'PUBLISHED' || false)
  const [title, setTitle] = React.useState(post?.title || '')
  const [slug, setSlug] = React.useState(post?.slug || '')
  const [summary, setSummary] = React.useState(post?.summary || '')
  const [content, setContent] = React.useState(post?.content || '')
  const [error, setError] = React.useState()
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('sm'));
  const tag = useSelector((state) => state.tag)
  const [newPost,] = useNewPostMutation()
  const [updatePost,] = useUpdatePostMutation()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const handlePost = async (draft = '') => {
    const status = (draft || (postStatus ? 'Published' : 'Private')).toUpperCase()
    const tags = tag.postTags
    const new_post = { title, slug, summary, content, tags, status, enable_comments: enableComments }
    try {
      let data
      if (postId) {
        data = await updatePost({ postId, post: new_post }).unwrap()
      } else {
        data = await newPost(new_post).unwrap()
      }
      if (data?.msg === 'OK') {
        setError(null)
        navigate(from || `/admin/post/${data.post.id}`)
      } else if (data?.msg === 'error') {
        setError(data.error)
      }
    } catch (error) {
      console.error(error)
    }
    // setPostStatus(postStatus === 'Published' ? : 'Private')
  }

  return (
    <Box>
      <Grid container spacing={1} sx={{ pt: 1 }}  >
        <Grid item xs={12}>
          <Grid container
            direction='row'
            justifyContent="space-between"
            alignItems="stretch"
          >
            <Grid item xs={12} md={8}>
              <Typography
                gutterBottom
                align="center"
                height={40}
              >
                Post
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}
              sx={{ display: 'flex', flexDirection: "row", alignItems: 'flex-end' }}
            >
              <FormControlLabel
                required
                control={
                  <Switch
                    checked={postStatus}
                    onChange={() => { setPostStatus(!postStatus) }}
                  />}
                labelPlacement="start"
                label={
                  <Typography sx={{ minWidth: 80 }}>{postStatus ? 'Published' : 'Private'}</Typography>
                }
              />
              <FormControlLabel
                required
                control={
                  <Switch
                    checked={enableComments}
                    onChange={() => { setEnableComments(!enableComments) }}
                  />
                }
                labelPlacement="start"
                label={
                  <Typography >{enableComments ? 'Enable comments' : 'Disable comments'}</Typography>
                } />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', flexDirection: "column", alignItems: 'stretch' }}>
          <TextField
            id="title"
            label="title"
            required
            value={title}
            onChange={(e) => { setTitle(e.target.value) }}
          />
        </Grid>
        <Grid item xs={12} >
          <TextField
            id="slug"
            label="slug"
            fullWidth
            value={slug}
            onChange={(e) => { setSlug(e.target.value) }} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="summary"
            label="summary"
            fullWidth
            multiline
            minRows={3}
            value={summary}
            onChange={(e) => { setSummary(e.target.value) }}
          />
        </Grid>
        <Grid item xs={12} >
          <Grid
            container
            spacing={1}
          >
            <Grid item xs={12} md={10}>
              <TagsSelect />
            </Grid>
            <Grid item xs={12} md={2}
              sx={{ display: 'flex' }}
            >
              <NewTag />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ minHeight: matches ? 500 : 300 }}>
          <MDEditor
            value={content}
            onChange={setContent}
            visibleDragbar={false}
            height={'100%'}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {error ? <Typography color={'error'}>{error}</Typography> : null}
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >

            <Button
              variant="outlined"
              onClick={() => handlePost('DRAFT')}
            >
              DRAFT
            </Button>
            <Button
              variant="contained"
              onClick={() => handlePost()}
            >
              Post
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>

  )
}

Post.propTypes = {
  post: PropTypes.object,
  tags: PropTypes.array
};


export default function NewPost() {
  const { postId } = useParams()
  const { data, isLoading } = useGetPostQuery(postId, { skip: !postId })
  const post = data?.post || {}
  const tags = data?.tags || []
  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(setPostTags({ postTags: tags }))
  }, [data])
  if (isLoading) return <Typography>Loading...</Typography>
  return <Post post={post} />
} 