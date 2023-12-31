import * as React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentAuth } from "./api/authSlice";

import PropTypes from "prop-types";

export function RequireAuth({ children }) {
  const auth = useSelector(selectCurrentAuth);
  const location = useLocation();
  if (!auth?.isAdmin) {
    return (
      <Navigate
        to="/"
        state={{ from: location, message: `user not allowed` }}
        replace
      />
    );
  }
  return children;
}

RequireAuth.propTypes = {
  children: PropTypes.any,
};
