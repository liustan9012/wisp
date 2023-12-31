import * as React from "react";
import Avatar from "@mui/material/Avatar";
// import Stack from '@mui/material/Stack';
import PropTypes from "prop-types";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function StringAvatar({ name, alt, bgcolor = "", ...restProps }) {
  const namestr = name || alt;
  let children = namestr;
  if (namestr.split(" ")?.length > 1) {
    children = `${namestr.split(" ")[0][0]}${namestr.split(" ")[1][0]}`;
  } else {
    children = namestr.slice(0, 2);
  }
  children = children.toUpperCase();
  const newProps = {
    sx: {
      bgcolor: bgcolor || stringToColor(namestr),
    },
    children,
    alt,
    ...restProps,
  };
  return <Avatar {...newProps} />;
}

StringAvatar.propTypes = {
  name: PropTypes.string,
  alt: PropTypes.string.isRequired,
  bgcolor: PropTypes.string,
};

export default StringAvatar;
