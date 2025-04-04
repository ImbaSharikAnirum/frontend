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
  const ManagerId = process.env.REACT_APP_MANAGER;
  return (
    <div className="header" style={{ zIndex: "1" }}>
      <Logo style={{ height: "25px", width: "auto" }} />
      <div>
        {" "}
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
        <Link
          to="/guides"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <button className="button_white button-animate-filter">
            <div className="h5">Гайды</div>
          </button>
        </Link>
        <Link
          to="/skill-tree"
          style={{
            textDecoration: "none",
            color: "black",
          }}
        >
          <button className="button_white button-animate-filter">
            <div className="h5">Древо навыков</div>
          </button>
        </Link>
        {user?.role?.id === Number(ManagerId) && (
          <Link
            to="/chat"
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <button className="button_white button-animate-filter">
              <div className="h5">Чат</div>
            </button>
          </Link>
        )}
      </div>

      {/* <AuthButtons /> */}
      {user ? <UserProfile /> : <AuthButtons />}
    </div>
  );
}

export default Header;
