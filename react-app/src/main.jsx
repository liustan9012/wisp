import React, { Suspense } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import "./i18n"
import "./index.css"

import { SWRConfig } from "swr"

import { useSWROptions } from "./api/auth"
import router from "./routes"
import CustmerThemeProvider from "./themeProvider"

const App = () => {
  const options = useSWROptions()
  return (
    <SWRConfig value={options}>
      <Suspense fallback="loading">
        <CustmerThemeProvider>
          <CssBaseline />
          <RouterProvider router={router} />
        </CustmerThemeProvider>
      </Suspense>
    </SWRConfig>
  )
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
