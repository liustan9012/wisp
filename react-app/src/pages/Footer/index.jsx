import * as React from 'react';
import { Typography, Link } from "@mui/material";


export default function Footer(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center" {...props}
      sx={{
        mt: 4, mb: 4,
        flex: '0 0 auto'
      }}
    >
      <Link color="inherit" href={"/"}>
        Home
      </Link>
      {' '}
      {'Copyright © '}

      {' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}