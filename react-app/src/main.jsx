import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import "./i18n";

import "./index.css";
import router from "./routes";
import { store } from "./store";
import CustmerThemeProvider from "./themeProvider";

const App = () => {
  return (
    <Suspense fallback="loading">
      <CustmerThemeProvider>
        <CssBaseline />
        <RouterProvider router={router} />
      </CustmerThemeProvider>
    </Suspense>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
