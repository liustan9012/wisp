import * as React from "react"
import { Navigate, useLocation } from "react-router-dom"

import { useAuthStore } from "./store"

export function RequireAuth({ children }) {
  const auth = useAuthStore((state) => state.auth)
  const location = useLocation()
  if (!auth?.isAdmin) {
    return (
      <Navigate
        to="/"
        state={{ from: location, message: `user not allowed` }}
        replace
      />
    )
  }
  return children
}
