import React from "react";
import ArticleIcon from "@mui/icons-material/Article";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CommentIcon from "@mui/icons-material/Comment";
import LabelIcon from "@mui/icons-material/Label";
import LinkIcon from "@mui/icons-material/Link";
import PersonIcon from "@mui/icons-material/Person";
import Divider from "@mui/material/Divider";
import { Drawer, Box, Tooltip, Menu, Link, Stack, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme, styled } from "@mui/material/styles";
import NestedListItem from "../Componets/NestedListItem";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectCurrentAuth } from "../../api/authSlice";
import UserAvatar from "../Componets/UserAvatar";
import { useTranslation } from "react-i18next";
import LanguageToggle from "../Componets/LanguageTogole";
import LightModeToggle from "../Componets/LightToggle";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export function DashboardAppBar({ open, handleDrawerOpen }) {
  const theme = useTheme();
  const { t } = useTranslation();
  const auth = useSelector(selectCurrentAuth);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenUserMenu = () => {};
  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                textTransform: "capitalize",
              }}
            >
              {t("dashboard")}
            </Typography>
          </Box>
          <Stack direction={"row"}>
            <Button
              component={RouterLink}
              to="/"
              variant="h6"
              color="inherit"
              underline="none"
            >
              {t("home")}
            </Button>
            <Button
              component={RouterLink}
              to="/navlink"
              variant="h6"
              color="inherit"
              underline="none"
            >
              {t("navlink")}
            </Button>
          </Stack>
          <Stack direction={"row"} spacing={1}  sx={{alignItems:"center"}}>
            <LanguageToggle />
            <LightModeToggle />
            <UserAvatar />
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
DashboardAppBar.propTypes = {
  open: PropTypes.bool,
  handleDrawerOpen: PropTypes.func,
};

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export function DashboardDrawer({ open, handleDrawerClose }) {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="admin-dashboard"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{ textTransform: "capitalize" }}
          >
            {t("admin dashboard")}
          </ListSubheader>
        }
      >
        {[
          {
            item: { to: "/admin/user", icon: PersonIcon, text: t("user") },
            nestedItems: [
              { to: "/admin/user/list", text: t("user list") },
              { to: "/admin/user/create", text: t("create user") },
            ],
          },
          {
            item: { to: "/admin/post", icon: ArticleIcon, text: t("post") },
            nestedItems: [
              { to: "/admin/post/list", text: t("post list") },
              { to: "/admin/post/create", text: t("create post") },
            ],
          },
          {
            item: { to: "/admin/tag", icon: LabelIcon, text: t("tag") },
            nestedItems: [
              { to: "/admin/tag/list", text: t("tag list") },
              { to: "/admin/tag/create", text: t("create tag") },
            ],
          },
          {
            item: {
              to: "/admin/comment",
              icon: CommentIcon,
              text: t("comment"),
            },
            nestedItems: [
              { to: "/admin/comment/list", text: t("comment list") },
            ],
          },
          {
            item: { to: "/admin/navlink", icon: LinkIcon, text: t("link") },
            nestedItems: [
              { to: "/admin/navlink/list", text: t("navlink list") },
              { to: "/admin/navlink/create", text: t("create navlink") },
            ],
          },
        ].map(({ item, nestedItems }) => (
          <NestedListItem key={item.to} item={item} nestedItems={nestedItems} />
        ))}
      </List>
    </Drawer>
  );
}

DashboardDrawer.propTypes = {
  open: PropTypes.bool,
  handleDrawerClose: PropTypes.func,
};

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));
