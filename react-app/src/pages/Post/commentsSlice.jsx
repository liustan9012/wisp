import { createSlice } from "@reduxjs/toolkit";

export const commentsSlice = createSlice({
  name: "comment",
  initialState: {
    newComment: "",
  },
  reducers: {
    setNewComment: (state, action) => {
      state.newComment = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setNewComment } = commentsSlice.actions;

export default commentsSlice.reducer;

// export const selectCurrentAuth = (state) => state.auth
