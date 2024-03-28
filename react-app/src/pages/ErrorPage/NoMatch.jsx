import React from "react"
import { Box, Link, Typography } from "@mui/material"
import { Link as RouteLink, useLocation } from "react-router-dom"

export default function NoMatch() {
  const location = useLocation()
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5"> Oops! </Typography>
      <Typography>
        {`Sorry, page for '${location.pathname}' not found.`}
      </Typography>

      <Typography>
        {`back to `}
        {location.pathname.includes("/admin") ? (
          <Link component={RouteLink} to="/admin">{`Admin`}</Link>
        ) : (
          <Link component={RouteLink} to="/">{`Home`}</Link>
        )}
      </Typography>
    </Box>
  )
}
