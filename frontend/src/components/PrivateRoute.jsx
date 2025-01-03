import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    // If no token is present, redirect to login page
    return <Navigate to="/" replace />;
  }

  return children; // Render the child components (Dashboard, Friends, etc.) if authenticated
};

export default PrivateRoute;
