import CircleIcon from "@mui/icons-material/Circle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";
import * as React from "react";
import { NavLink, useMatch, useNavigate } from "react-router-dom";

import { styled } from "@mui/material/styles";

const Nav = styled(NavLink)(() => ({
  textDecoration: "none",
  color: "inherit",
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
  const matchColor = match ? "primary" : "inherit";
  if (!!!nestedItems)
    return (
      <ListItemButton component={Nav} to={item.to} selected={!!match}>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <item.icon color={matchColor} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography color={matchColor} sx={{ textTransform: "capitalize" }}>
              {item.text}
            </Typography>
          }
        />
      </ListItemButton>
    );

  return (
    <>
      <ListItemButton onClick={handleClick} selected={!!match}>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <item.icon color={matchColor} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography color={matchColor} sx={{ textTransform: "capitalize" }}>
              {item.text}
            </Typography>
          }
        />
        {open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {nestedItems.map((nested) => (
            <Nav key={nested.to} to={nested.to}>
              {({ isActive }) => (
                <ListItemButton sx={{ pl: 2 }} selected={isActive}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CircleIcon
                      sx={{ fontSize: isActive ? 12 : 8, minWidth: 24 }}
                      color={isActive ? "primary" : "inherit"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography color={isActive ? "primary" : "inherit"} sx={{ textTransform: "capitalize" }}>
                        {nested.text}{" "}
                      </Typography>
                    }
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
  nestedItems: PropTypes.array,
};
