import React from "react"
import { Typography } from "@mui/material"

import { useSelector } from "react-redux"
import { selectCurrentAuth } from "../../api/authSlice"
import { useGetHelloQuery } from "../../api/auth"

export default function About() {
  const { data, error, isLoading } = useGetHelloQuery()
  const auth = useSelector(selectCurrentAuth)
  return (
    <Typography
      variant="button"
      display="block"
      gutterBottom
    >
      <p>Hello 1</p>
      <p>data :
        {error ? (
          <>Oh no, there was an error</>
        ) : isLoading ? (
          <>Loading...</>
        ) : data ? (
          <>
            {`${data} ${auth.username || ""}`}
          </>
        ) : null}
      </p>
      {/* <p>error {error}</p> */}
      {/* <p>isLoading {isLoading}</p> */}
    </Typography>
  )
}