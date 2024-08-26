import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsInitialized,
} from "../redux/reducers/authReducer";

const PrivateRoute = ({ children, allowedRoles }) => {
  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsInitialized);

  if (!isInitialized) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  const isAllowed = user && user.role && allowedRoles.includes(user.role.id);
  return isAllowed ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;
