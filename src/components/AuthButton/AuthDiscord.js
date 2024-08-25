import React from "react";
import { Link } from "react-router-dom";
import DiscordIcon from "../../images/DiscordIcon";
import { Button } from "@mui/material";

export default function AuthDiscord() {

  const API = process.env.REACT_APP_API;
  return (
    <Link
      to={`${API}/connect/discord`}
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Button
        variant="contained"
        startIcon={<DiscordIcon />}
        sx={{
          fontSize: "10px",
          borderRadius: "90px",
          width: "100%",
          backgroundColor: "#5865F2",
          color: "white",
          "&:hover": {
            // Цвет при наведении
            backgroundColor: "#4e5d94", // Слегка темнее основного цвета
          },
          "&:active": {
            // Цвет при нажатии
            backgroundColor: "#3e4b84", // Еще немного темнее
          },
        }}
      >
        Войти через Discord
      </Button>
    </Link>
  );
}
