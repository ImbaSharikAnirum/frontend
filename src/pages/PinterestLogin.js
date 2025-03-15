import React from "react";

const PinterestLogin = () => {

  const handleLogin = () => {
    const clientId = process.env.REACT_APP_PINTEREST_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_PINTEREST_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error(
        "Не заданы REACT_APP_PINTEREST_CLIENT_ID или REACT_APP_PINTEREST_REDIRECT_URI"
      );
      return;
    }

    const authUrl = `https://www.pinterest.com/oauth/?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=pins:read,boards:read`;

    window.location.href = authUrl; // Переадресация на Pinterest для авторизации
  };

  return (
    <button
      className="button_secondary Body-3 button-animate-filter"
      onClick={handleLogin}
      style={{ marginTop: "16px" }}
    >
      Авторизация Pinterest
    </button>
  );
};

export default PinterestLogin;
