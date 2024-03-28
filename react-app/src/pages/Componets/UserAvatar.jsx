import * as React from "react"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { IconButton, Link, Menu, MenuItem, useTheme } from "@mui/material"
import { useTranslation } from "react-i18next"
import {
  Link as RouterLink,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom"

import { useSignOut } from "../../api/auth"
import StringAvatar from "../../Componets/StringAvatar"
import { useAuthStore } from "../../store"

const UserAvatar = ({ adminMenus }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const currentUrl = `${location.pathname}${location.search}`
  const dashBoardMatch = useMatch({ path: "/admin", end: false })
  const auth = useAuthStore((state) => state.auth)
  const unsetUser = useAuthStore((state) => state.unsetUser)
  const { trigger: signOut } = useSignOut()

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.log(error)
    }
    unsetUser()
    navigate(0)
  }

  const menusGuest = [
    { key: t("signin"), to: "/signin" },
    { key: t("signup"), to: "/signup" },
  ]

  const logoutMenu = {
    key: t("logout"),
    to: currentUrl || "/",
    onClick: async () => {
      await handleSignOut()
      handleCloseUserMenu()
    },
  }
  const changepasswordMenu = {
    key: t("settings"),
    to: "/settings",
  }

  const menusUser = [
    { key: t("home"), to: "/" },
    changepasswordMenu,
    logoutMenu,
  ]
  const menusAdmin = [
    { key: t("new post"), to: "/post/new" },
    { key: t("dashboard"), to: "/admin" },
  ].concat(menusUser)

  const menusDashBoard = [
    { key: t("new post"), to: "/admin/post/create" },
    { key: t("new navlink"), to: "/admin/navlink/create" },
    changepasswordMenu,
    logoutMenu,
  ]

  let menus = (!!adminMenus && auth.isAdmin ? adminMenus : []).map(
    ({ key, to, onClick }) => ({
      key,
      to,
      onClick: () => {
        onClick()
        handleCloseUserMenu()
      },
    })
  )
  if (!!auth?.username) {
    if (auth.isAdmin) {
      if (dashBoardMatch) {
        menus.push(...menusDashBoard)
      } else {
        menus.push(...menusAdmin)
      }
    } else {
      menus.push(...menusUser)
    }
  } else {
    menus.push(...menusGuest)
  }
  return (
    <>
      <IconButton onClick={handleOpenUserMenu}>
        {auth?.username ? (
          <StringAvatar alt="User" name={auth.username} />
        ) : (
          <AccountCircleIcon fontSize="large" color="primary" />
        )}
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
        {menus.map(({ key, to, onClick }) => (
          <MenuItem
            key={key}
            onClick={onClick || handleCloseUserMenu}
            disableGutters
          >
            <Link
              sx={{ width: 1, pl: 2, pr: 2 }}
              component={RouterLink}
              to={to}
              state={{ from: location }}
              underline="none"
            >
              {key}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default UserAvatar
