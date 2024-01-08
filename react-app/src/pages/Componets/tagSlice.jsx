import { createSlice } from "@reduxjs/toolkit";

export const tagsSlice = createSlice({
  name: "tag",
  initialState: {
    tags: [],
    selectTags: [],
  },
  reducers: {
    setUserTags: (state, action) => {
      state.tags = action.payload.tags;
    },
    newTag: (state, action) => {
      state.tags.push(action.payload.tag);
      state.selectTags.push(action.payload.tag);
    },
    setSelectTags: (state, action) => {
      state.selectTags = action.payload.selectTags;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserTags, newTag, setSelectTags } = tagsSlice.actions;

export const selectCurrentTag = (state) => state.tag;

export default tagsSlice.reducer;

// export const selectCurrentAuth = (state) => state.auth
