import React from "react"
import { Typography } from "@mui/material"
import { RequireAuth } from "../../context"



export default function Account() {
  return (
    <RequireAuth>
      <Typography
        variant="button"
        display="block"
        gutterBottom
      >
        Account
      </Typography>
    </RequireAuth>

  )
}