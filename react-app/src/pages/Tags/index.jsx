import React from 'react'
import { Typography, Box, Divider, Chip, } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useGetTagsPostsQuery } from '../../api/tag'

export default function TagsPage() {
  const { data, isLoading } = useGetTagsPostsQuery()
  if (isLoading) return <Typography>Loading...</Typography>
  if (!data || data?.msg === 'error') return <Typography>Missing tags!</Typography>
  const { tags } = data
  return (
    <Box direction={'row'} spacing={1} divider={<Divider orientation="vertical" flexItem />}>
      {tags.length ?
        <>
          {tags.map((t) => <Chip
            key={t.id}
            to={`/tag/${t.id}`}
            component={RouterLink}
            underline='none'
            label={
              <Typography noWrap>{t.name}
                <Typography component={'span'} sx={{ color: 'primary.main', pl: 1 }} noWrap>{t.post_count}</Typography>
              </Typography>
            }
            clickable
            sx={{ ml: 2, mt: 2 }}
          >
          </Chip>
          )}
        </>
        : null}
    </Box>
  )

}