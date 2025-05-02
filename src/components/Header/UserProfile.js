import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, logout } from "../../redux/reducers/authReducer";
import { Button, Box, Avatar } from "@mui/material";
import { clearStudents } from "../../redux/reducers/studentReducer";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(clearStudents());
    dispatch(logout());
  };

  if (!user) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Link to={`/profile/${user.id}`}>
        <Avatar
          sx={{
            height: 40,
            width: 40,
            mr: 2,
          }}
          alt="Avatar"
          src={user?.avatar?.formats?.small?.url || ""}
        />
      </Link>
      <button
        className="button_white"
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div className="h5">{t("header.logout")}</div>
      </button>
    </div>
  );
}

export default UserProfile;
