
import React from "react";
import { Typography, Stack, Paper, Link, CardContent, CardActions, CardHeader, Card, Divider, Chip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useGetPostListQuery } from '../../api/post'
import { timeConverter } from '../../utils/datetime'


export default function PostList() {

  const { data, isLoading, } = useGetPostListQuery()

  if (isLoading) return <Typography>Loading...</Typography>
  if (!data || data?.msg === 'error') return <Typography>Missing post!</Typography>
  const { posts } = data
  return (
    <Paper elevation={0} sx={{ mt: 2 }}>
      {posts.map((post) => (
        <Card key={post.id} elevation={1} sx={{ mt: 2 }}>
          <CardHeader
            title={<Link to={`/post/${post.id}`} component={RouterLink} underline="none">{post.title}</Link>}
            subheader={
              <Stack direction={'row'} spacing={1} divider={<Divider orientation="vertical" flexItem />}>
                <Typography>{timeConverter(post.created_at)}</Typography>
                {post.tags.length ?
                  <>
                    {post.tags.map((t) => <Chip
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
            }
          />
          <CardContent>
            <Typography>{post?.summary || post.title}</Typography>
          </CardContent>
          <CardActions >
            <Link sx={{ pl: 1 }} to={`/post/${post.id}`} component={RouterLink} underline="none">more </Link>
          </CardActions>
        </Card>
      ))
      }


    </Paper >
  )
}