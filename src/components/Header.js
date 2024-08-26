import React from "react";
import "../styles/buttons.css";
import "../styles/header.css";
import { ReactComponent as Logo } from "../images/AnirumLogo.svg";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthButtons from "./Header/AuthButtons";
import UserProfile from "./Header/UserProfile";
import { selectCurrentUser } from "../redux/reducers/authReducer";

function Header() {
  const user = useSelector(selectCurrentUser);
  return (
    <div className="header" style={{ zIndex: "1" }}>
      <Logo style={{ height: "25px", width: "auto" }} />

      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <button className="button_white button-animate-filter">
          <div className="h5">Курсы</div>
        </button>
      </Link>
      {/* <AuthButtons /> */}
      {user ? <UserProfile /> : <AuthButtons />}
    </div>
  );
}

export default Header;
