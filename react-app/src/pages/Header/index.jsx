import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
// import Typography from '@mui/material/Typography';
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import { Link, Stack, Typography, useTheme } from "@mui/material";
import { Link as RouterLink, useMatch } from "react-router-dom";

import UserAvatar from "../Componets/UserAvatar";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import LightModeToggle from "../Componets/LightToggle";
import LanguageToggle from "../Componets/LanguageTogole";

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const theme = useTheme();
  const { t } = useTranslation();
  const pages = [
    { to: `/posts`, context: t("blog") },
    { to: "/tags", context: t("tag") },
    { to: "/timeline", context: t("timeline") },
    { to: "/about", context: t("about") },
  ].map(({ to, context }) => ({
    to,
    context,
    selected: useMatch({ path: to, end: false }) ? true : false,
  }));

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{
        m: "0 auto",
        maxWidth: { xs: 1, lg: 1400 },
        flex: "0 0 auto",
        boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2)",
      }}
    >
      <Container maxWidth="xl" sx={{}}>
        <Toolbar disableGutters>
          <IconButton to="/" component={RouterLink} sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} color="primary">
            <AdbIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map(({ to, context, selected }) => (
                <MenuItem key={context} onClick={handleCloseNavMenu} selected={selected}>
                  <Link component={RouterLink} to={to} underline="none" sx={{ width: 1 }}>
                    {context}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map(({ to, context, selected }) => (
              <Button key={context} onClick={handleCloseNavMenu} sx={{ my: 2 }} to={to} component={RouterLink}>
                <Typography variant="button" color={selected ? theme.palette.primary[900] : "primary"}>
                  {context}
                </Typography>
              </Button>
            ))}
          </Box>
          <Stack direction={"row"} spacing={1} sx={{ alignItems: "center" }}>
            <Button component={RouterLink} to="/navlink" underline="none">
              <Typography variant="button">{t("navlink")}</Typography>
            </Button>
            <LanguageToggle color="primary" />
            <LightModeToggle color="primary" />
            <UserAvatar />
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
