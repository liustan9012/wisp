import React from "react";
import ArticleIcon from '@mui/icons-material/Article';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CommentIcon from '@mui/icons-material/Comment';
import LabelIcon from '@mui/icons-material/Label';
import LinkIcon from '@mui/icons-material/Link';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useTheme, styled } from '@mui/material/styles';
import NestedListItem from './NestedListItem';
import PropTypes from 'prop-types';

const drawerWidth = 240;


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));



export function DashboardAppBar({ open, handleDrawerOpen }) {
  return (
    <>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Persistent drawer
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}
DashboardAppBar.propTypes = {
  open: PropTypes.bool,
  handleDrawerOpen: PropTypes.func,
}

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));



export function DashboardDrawer({ open, handleDrawerClose }) {
  const theme = useTheme()
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="admin-dashboard"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Admin Dashboard
          </ListSubheader>
        }
      >
        {[
          {
            item: { to: '/admin/user', icon: PersonIcon, text: 'User' },
            nestedItems: [
              { to: '/admin/user/list', text: 'List' },
              { to: '/admin/user/create', text: 'Create' },
            ],
          },
          {
            item: { to: '/admin/post', icon: ArticleIcon, text: 'Post' },
            nestedItems: [
              { to: '/admin/post/list', text: 'List' },
              { to: '/admin/post/create', text: 'Create' },
            ],
          },
          {
            item: { to: '/admin/tag', icon: LabelIcon, text: 'Tag' },
            nestedItems: [
              { to: '/admin/tag/list', text: 'List' },
              { to: '/admin/tag/create', text: 'Create' },
            ],
          },
          {
            item: { to: '/admin/comment', icon: CommentIcon, text: 'Comment' },
            nestedItems: [
              { to: '/admin/comment/list', text: 'List' },
            ],
          },
          {
            item: { to: '/admin/link', icon: LinkIcon, text: 'Link' },
            nestedItems: [
              { to: '/admin/link/list', text: 'List' },
              { to: '/admin/link/create', text: 'Create' },
            ],
          },
        ].map(({ item, nestedItems }) => (<NestedListItem
          key={item.to}
          item={item}
          nestedItems={nestedItems}
        />)
        )}


      </List>
    </Drawer >
  )
}

DashboardDrawer.propTypes = {
  open: PropTypes.bool,
  handleDrawerClose: PropTypes.func,
}


export const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

