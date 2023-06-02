import { createSlice } from '@reduxjs/toolkit'



export const tagsSlice = createSlice({
  name: 'tag',
  initialState: {
    tags: [],
    postTags: [],
  },
  reducers: {
    setUserTags: (state, action) => {
      state.tags = action.payload.tags
    },
    newTag: (state, action) => {
      state.tags.push(action.payload.tag)
      state.postTags.push(action.payload.tag)

    },
    setPostTags: (state, action) => {
      state.postTags = action.payload.postTags
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUserTags, newTag, setPostTags } = tagsSlice.actions

export default tagsSlice.reducer

// export const selectCurrentAuth = (state) => state.auth
