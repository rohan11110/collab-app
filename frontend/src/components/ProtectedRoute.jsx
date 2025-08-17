import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  // If no user in redux → redirect to login
  if (!user || !user.token) {
    return <Navigate to="/login-screen" replace />;
  }

  return children;
};

export default ProtectedRoute;
