import React from "react"
import { Typography } from "@mui/material"

import  { useGetHelloQuery } from '../../api/auth'
import { useSelector } from "react-redux"
import { selectCurrentAuth } from "../../api/authSlice"

export default function Home() {
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