import React, { createContext, useEffect, useMemo, useState } from "react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

import { zhCN, enUS } from "@mui/material/locale";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme, setPalette } from "./api/themeSlice";

export const ChangeThemeContext = createContext(() => {});

function CustmerThemeProvider(props) {
  const { children } = props;
  const localetheme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const [light, setLight] = useState(localetheme.palette?.mode || "light");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.setAttribute("data-color-mode", light);
  }, [light]);

  const changeLight = () => {
    const newLight = light === "light" ? "dark" : "light";
    setLight(newLight);
    dispatch(setPalette({ palette: { mode: newLight } }));
  };
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
  };

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
  );

  const contextValue = useMemo(
    () => ({
      changeLight,
      changeLanguage,
    }),
    [i18n.language, changeLight, changeLanguage]
  );

  return (
    <ChangeThemeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ChangeThemeContext.Provider>
  );
}

export default CustmerThemeProvider;
