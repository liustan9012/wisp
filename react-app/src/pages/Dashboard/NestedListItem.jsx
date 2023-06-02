import CircleIcon from '@mui/icons-material/Circle';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from 'prop-types';
import * as React from 'react';
import { NavLink, useMatch } from "react-router-dom";

import { styled } from '@mui/material/styles';

const Nav = styled(NavLink)(() => ({
  textDecoration: 'none',
  color: 'inherit',
  // alignItems: 'center',
  // padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  // ...theme.mixins.,
  // justifyContent: 'flex-end',
}));

export default function NestedListItem({ item, nestedItems }) {
  const match = useMatch({ path: item.to, end: false });
  const [open, setOpen] = React.useState(match ? true : false);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <>
      <ListItemButton onClick={handleClick} selected={!!match}>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <item.icon color={match ? 'primary' : 'inherit'} />
        </ListItemIcon>
        <ListItemText primary={<Typography color={match ? 'primary' : 'inherit'} >{item.text} </Typography>} />
        {open ? <ExpandLess fontSize='small' /> : <ExpandMore fontSize='small' />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {nestedItems.map((nested) => (
            <Nav key={nested.to} to={nested.to} >
              {({ isActive, }) => (
                <ListItemButton sx={{ pl: 2 }} selected={isActive}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CircleIcon
                      sx={{ fontSize: isActive ? 12 : 8, minWidth: 24 }}
                      color={isActive ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary={
                    <Typography color={isActive ? 'primary' : 'inherit'} >{nested.text} </Typography>}
                  />
                </ListItemButton>
              )}
            </Nav>
          ))}
        </List>
      </Collapse>
    </>
  );
}

NestedListItem.propTypes = {
  item: PropTypes.object,
  nestedItems: PropTypes.array
}