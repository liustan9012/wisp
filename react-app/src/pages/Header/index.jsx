import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
// import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useTheme } from '@mui/material/styles';
import { Link } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import StringAvatar from '../../componets/StringAvatar'
import { useSignOutMutation } from '../../api/auth';
import { unsetUser, selectCurrentAuth } from '../../api/authSlice';




function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useSelector(selectCurrentAuth)
  const pages = [
    // { to: auth.username ? `/user/${auth.userid}/posts`: `/posts`, context: "Blog" },
    { to: `/posts`, context: "Blog" },
    { to: "/tags", context: "Tag" },
    { to: "/timeline", context: "Timeline" },
    { to: "/about", context: "About" },
  ]
  const [signOut,
    // { isLoading, isError },
  ] = useSignOutMutation()
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleSignOut = async () => {
    try {
      await signOut().unwrap()
      dispatch(unsetUser())
      navigate(location || '/')
      // }
    } catch (error) {
      console.error(error)
    }

  }
  const menusGuest = [
    { key: "Signin", to: "/signin", },
    { key: "SignUp", to: "/signup", },
  ]
  const menusUser = [
    { key: "About", to: "/about", },
    {
      key: "Logout",
      to: "",
      onClick: () => {
        handleSignOut()
        handleCloseUserMenu()
      },
    },
  ]
  const menusAdmin = [
    { key: "New Post", to: "/post/new", },
    { key: "Dashboard", to: "/admin", },
  ].concat(menusUser)


  return (
    <AppBar position="static" color="inherit" sx={{ flex: '0 0 auto' }}>
      <Container maxWidth="xl" sx={{ borderBottom: "1px solid #0000001f" }} >
        <Toolbar disableGutters >
          <IconButton to="/"
            component={RouterLink}
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
            color="primary"
          >
            <AdbIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
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
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map(({ to, context, }) => (
                <MenuItem key={context} onClick={handleCloseNavMenu}>
                  <Link
                    component={RouterLink}
                    to={to}
                    underline="none">
                    {context}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} color="primary" />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(({ to, context, }) => {
              return (
                <Button
                  key={context}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, display: 'block' }}
                  to={to}
                  component={RouterLink}
                >
                  {context}
                </Button>
              )
            }
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} color="primary" sx={{ p: 0 }}>
                <StringAvatar alt="User" name={auth?.username} sx={{ bgcolor: theme.palette.primary.main }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {(auth?.username ?
                auth?.isAdmin ?
                  menusAdmin
                  : menusUser
                : menusGuest).map(({ key, to, onClick }) =>
                  <MenuItem key={key} onClick={onClick || handleCloseUserMenu}>
                    <Link component={RouterLink} to={to} state={{ from: location }} underline="none"  >
                      {key}
                    </Link>
                  </MenuItem>)}
            </Menu>
          </Box>
        </Toolbar>
      </Container >
    </AppBar >
  );
}
export default Header;