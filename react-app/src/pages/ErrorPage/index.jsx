import React from "react";
import { Typography, Box } from "@mui/material"
import { useLocation, useRouteError } from "react-router-dom";

import NoMatch from './NoMatch'

export {
  NoMatch,
}


export default function ErrorPage() {
  const error = useRouteError();
  const location  =useLocation()
  const state = location.state
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant='h5'> Oops! </Typography>
      <Typography>
        Sorry, an unexpected error has occurred.
      </Typography>
      <Typography variant='body2'>
        <i>{error?.statusText || error?.message}</i>
      </Typography>
      <Typography variant='body2'>
        <i>{state?.message}</i>
      </Typography>
    </Box>

  )
}