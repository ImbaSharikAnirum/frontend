import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentUser } from "../redux/reducers/authReducer";
import { clearStudents } from "../redux/reducers/studentReducer";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(clearStudents());
    dispatch(logout());
    navigate("/");
  };

  if (!user) return null;
  return (
    <div className="padding">
      <div
        className="Body-3"
        onClick={handleLogout}
        style={{ cursor: "pointer" }}
      >
        Выход
      </div>
    </div>
  );
}
