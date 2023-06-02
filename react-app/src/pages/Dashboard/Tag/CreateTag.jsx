import LabelIcon from '@mui/icons-material/Label';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetTagQuery, useNewTagMutation, useUpdateTagMutation } from "../../../api/tag";


function Tag({ tag }) {
  const [name, setName] = useState(tag?.name || '')
  const [error, setError] = useState('')
  const [updateTag,] = useUpdateTagMutation()
  const [newTag,] = useNewTagMutation()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      let data
      if (tag?.id) {
        data = await updateTag({ tagId: tag?.id, name }).unwrap()
      } else {
        data = await newTag({ name }).unwrap()
      }
      if (data?.msg === 'OK') {
        setError('')
        navigate(from || `/admin/tag/list`)
      } else if (data?.msg === 'error') {
        setError(data.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box sx={{
      marginTop: 8,
      minHeight: '80vh',
      display: "flex",
      flexDirection: 'column',
      alignItems: 'center'
    }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} >
        <LabelIcon />
      </Avatar>
      <Typography>
        {`Create Tag`}
      </Typography>
      <Box component="form" noValidate sx={{ mt: 5, minWidth: 360 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} >
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              label="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
        </Grid>
        <Typography variant="subtitle1" color="error.main" gutterBottom>
          {error ? error : ""}
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 5, mb: 2 }}
          onClick={handleSubmit}
        >
          {tag?.id ? `Update`: `Create` }
        </Button>

      </Box>
    </Box>
  )
}
Tag.propTypes = {
  tag: PropTypes.object,
};

export default function NewTag() {
  const { tagId } = useParams()
  const { data, isLoading } = useGetTagQuery(tagId, { skip: !tagId })
  const tag = data?.tag || {}
  if (isLoading) return <Typography>Loading...</Typography>
  return <Tag tag={tag} />
}
