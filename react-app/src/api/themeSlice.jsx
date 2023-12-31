import { createSlice } from "@reduxjs/toolkit";

const localSetTheme = (theme) => {
  localStorage.setItem("theme", JSON.stringify(theme));
};

const localGetTheme = () => {
  return JSON.parse(localStorage.getItem("theme") || "{}");
};

const localDeleteTheme = () => {
  localStorage.removeItem("theme");
};
// const localSetAccessToken = (accessToken) => {
//   localStorage.setItem('accessToken', JSON.stringify(accessToken))
// }

export const themeSlice = createSlice({
  name: "theme",
  initialState: () => localGetTheme(),
  reducers: {
    setPalette: (state, action) => {
      const { palette } = action.payload;
      state.palette = palette;
      localSetTheme(state);
    },
    unsetTheme: (state) => {
      state = {};
      localDeleteTheme();
    },
  },
});

// Action creators are generated for each case reducer function
export const { setPalette, unsetTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme;

export default themeSlice.reducer;
