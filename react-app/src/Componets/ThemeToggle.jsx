import * as React from "react";
import { IconButton, useTheme } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

export default function ThemeToggle() {
  const theme = useTheme();
  return (
    <IconButton size="small">
      <LightMode />
      <DarkMode />
    </IconButton>
  );
}
