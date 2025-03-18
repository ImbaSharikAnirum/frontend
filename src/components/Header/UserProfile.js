import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, logout } from "../../redux/reducers/authReducer";
import { Button, Box, Avatar } from "@mui/material";
import { clearStudents } from "../../redux/reducers/studentReducer";
import { Link } from "react-router-dom";

function UserProfile() {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

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
          src={user.avatar || ""}
        />
      </Link>
      <button
        className="button_secondary Body-3 button-animate-filter"
        onClick={handleLogout}
      >
        Выйти
      </button>
    </div>
  );
}

export default UserProfile;
