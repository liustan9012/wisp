import React, { createContext, useEffect, useMemo, useState } from "react"
import { enUS, zhCN } from "@mui/material/locale"
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles"
import { useTranslation } from "react-i18next"

import { useThemeStore } from "./store"

export const ChangeThemeContext = createContext(() => {})

function CustmerThemeProvider(props) {
  const { children } = props
  const localetheme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const [light, setLight] = useState(localetheme.palette?.mode || "light")
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", light)
  }, [light])

  const changeLight = () => {
    const newLight = light === "light" ? "dark" : "light"
    setLight(newLight)
    setTheme({ palette: { mode: newLight } })
  }
  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
  }

  const theme = createTheme(
    {
      palette: {
        mode: light,
        // mode: "dark",
        // primary: {
        //   main: green[500],
        // },
      },
    },
    i18n.language === "en" ? enUS : zhCN
  )

  const contextValue = useMemo(
    () => ({
      changeLight,
      changeLanguage,
    }),
    [i18n.language, changeLight, changeLanguage]
  )

  return (
    <ChangeThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ChangeThemeContext.Provider>
  )
}

export default CustmerThemeProvider
