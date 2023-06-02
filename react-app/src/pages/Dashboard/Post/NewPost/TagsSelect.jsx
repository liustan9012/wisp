import * as React from 'react';
// import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
// import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux'
import { useReqTagsMutation } from '../../../../api/tag';

import { setPostTags, setUserTags } from './tagSlice';

import PropTypes from 'prop-types';

function TagsComponent({ isLoading, ChangePostTags, reqUserTags }) {
  const tag = useSelector((state) => state.tag)
  const [open, setOpen] = React.useState(false);
  return (
    <Stack >
      <Autocomplete
        multiple
        disableCloseOnSelect
        id="post-tags"
        options={tag?.tags || []}
        onChange={ChangePostTags}
        getOptionLabel={(tag) => tag.name}
        value={tag.postTags}
        loading={isLoading}
        open={open}
        onOpen={() => {
          setOpen(true)
          reqUserTags()
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(tag, value) => tag.name === value.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            placeholder="tags"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </Stack>
  );
}


TagsComponent.propTypes = {
  isLoading: PropTypes.bool,
  ChangePostTags: PropTypes.func,
  reqUserTags: PropTypes.func,
}



export default function TagsSelect() {
  const dispatch = useDispatch()
  const [reqTags, { isLoading }] = useReqTagsMutation()


  const reqUserTags = async () => {
    const data = await reqTags().unwrap()
    dispatch(setUserTags({ tags: data.tags }))
  }
  const ChangePostTags = (e, value) => {
    dispatch(setPostTags({ postTags: value }))
  }

  return (
    <TagsComponent {...{ isLoading, ChangePostTags, reqUserTags }} />
  )
}
