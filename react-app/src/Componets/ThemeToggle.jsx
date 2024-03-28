import * as React from "react"
import { DarkMode, LightMode } from "@mui/icons-material"
import { IconButton, useTheme } from "@mui/material"

export default function ThemeToggle() {
  const theme = useTheme()
  return (
    <IconButton size="small">
      <LightMode />
      <DarkMode />
    </IconButton>
  )
}
