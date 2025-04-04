import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsInitialized,
} from "../redux/reducers/authReducer";

// ID роли менеджера — замени на актуальный, если у тебя ID другой
const ROLE = {
  MANAGER: 3, // например, 3 — это id роли "manager"
};

const PrivateRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsInitialized);

  if (!isInitialized) {
    return <div>Loading...</div>; // Загрузка, пока не инициализировались
  }

  const isManager = user && user.role && user.role.id === ROLE.MANAGER;

  return isManager ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;
