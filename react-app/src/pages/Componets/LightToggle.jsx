import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { ChangeThemeContext } from "../../themeProvider";

export default function LightModeToggle({ color }) {
  const theme = useTheme();
  const { changeLight } = useContext(ChangeThemeContext);
  return (
    <IconButton onClick={changeLight} color={color || "inherit"}>
      {theme.palette.mode === "light" ? <LightMode /> : <DarkMode />}
    </IconButton>
  );
}
