import React, { useContext } from "react"
import LanguageIcon from "@mui/icons-material/Language"
import { Box, IconButton, Menu, MenuItem, useTheme } from "@mui/material"

import { ChangeThemeContext } from "../../themeProvider"

export default function LanguageToggle({ color }) {
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const { changeLanguage } = useContext(ChangeThemeContext)
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  return (
    <>
      <IconButton onClick={handleOpenUserMenu} color={color || "inherit"}>
        <LanguageIcon />
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem onClick={() => changeLanguage("zh")}>{"中文"}</MenuItem>
        <MenuItem onClick={() => changeLanguage("en")}>{"English"}</MenuItem>
      </Menu>
    </>
  )
}
