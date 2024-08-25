import React from "react";
import { Link } from "react-router-dom";

function AuthButtons() {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
      <Link
        to="/login"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <button className="button Body-3 button-animate-filter">Вход</button>
      </Link>
      <Link
        to="/signup"
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <button className="button_secondary Body-3 button-animate-filter">
          Регистрация
        </button>
      </Link>
    </div>
  );
}

export default AuthButtons;
