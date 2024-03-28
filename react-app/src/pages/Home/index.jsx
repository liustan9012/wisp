import React from "react"
import { Typography } from "@mui/material"

import { usePostList } from "../../api/post"
import { useAuthStore } from "../../store"

export default function Home() {
  const { data, error, isLoading } = usePostList()
  const auth = useAuthStore((state) => state.auth)
  return (
    <Typography variant="button" display="block" gutterBottom>
      <p>Hello 1</p>
      <p>
        data :
        {error ? (
          <>Oh no, there was an error</>
        ) : isLoading ? (
          <>Loading...</>
        ) : data ? (
          <>{`post ${data.total} ${auth.username || ""}`}</>
        ) : null}
      </p>
      {/* <p>error {error}</p> */}
      {/* <p>isLoading {isLoading}</p> */}
    </Typography>
  )
}
