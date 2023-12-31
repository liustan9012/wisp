import * as React from "react";
import { Box, Tooltip, IconButton, Menu, Link, useTheme, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useLocation, useMatch, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StringAvatar from "../../Componets/StringAvatar";
import { selectCurrentAuth, unsetUser } from "../../api/authSlice";
import { useSignOutMutation } from "../../api/auth";
import { useTranslation } from "react-i18next";

const UserAvatar = ({ adminMenus }) => {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const dashBoardMatch = useMatch({ path: "/admin", end: false });
  const auth = useSelector(selectCurrentAuth);
  const [
    signOut,
    // { isLoading, isError },
  ] = useSignOutMutation();
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut().unwrap();
      dispatch(unsetUser());
      navigate(location || "/");
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const menusGuest = [
    { key: t("signin"), to: "/signin" },
    { key: t("signup"), to: "/signup" },
  ];

  const logoutMenu = {
    key: t("logout"),
    to: "/",
    onClick: () => {
      handleSignOut();
      handleCloseUserMenu();
    },
  };
  const changepasswordMenu = {
    key: t("settings"),
    to: "/settings",
  };

  const menusUser = [{ key: t("home"), to: "/" }, changepasswordMenu, logoutMenu];
  const menusAdmin = [
    { key: t("new post"), to: "/post/new" },
    { key: t("dashboard"), to: "/admin" },
  ].concat(menusUser);

  const menusDashBoard = [
    { key: t("new post"), to: "/admin/post/create" },
    { key: t("new navlink"), to: "/admin/navlink/create" },
    changepasswordMenu,
    logoutMenu,
  ];

  let menus = (!!adminMenus && auth.isAdmin ? adminMenus : []).map(({ key, to, onClick }) => ({
    key,
    to,
    onClick: () => {
      onClick();
      handleCloseUserMenu();
    },
  }));
  if (!!auth?.username) {
    if (auth.isAdmin) {
      if (dashBoardMatch) {
        menus.push(...menusDashBoard);
      } else {
        menus.push(...menusAdmin);
      }
    } else {
      menus.push(...menusUser);
    }
  } else {
    menus.push(...menusGuest);
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
          <MenuItem key={key} onClick={onClick || handleCloseUserMenu} disableGutters>
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
  );
};

export default UserAvatar;
