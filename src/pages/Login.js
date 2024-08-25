import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/services/authAPI";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/reducers/authReducer";
import { ReactComponent as EyeOff } from "../images/eye_off.svg";
import { ReactComponent as EyeOn } from "../images/eye_on.svg";
import { Link } from "react-router-dom";

import AuthDiscord from "../components/AuthButton/AuthDiscord";
import AuthGoogle from "../components/AuthButton/AuthGoogle";
import { toast } from "react-toastify";
import { useMediaQuery, useTheme } from "@mui/material";

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ identifier: email, password }).unwrap();

      dispatch(
        setUser({
          user: response.user,
          jwt: response.jwt,
        })
      );

      localStorage.setItem("token", response.jwt || "");
      localStorage.setItem("user", JSON.stringify(response.user));

      navigate(`/`);
      toast.success("Вы успешно вошли в систему!");
    } catch (error) {
      console.error("Failed to login:", error);
      toast.error("Произошла ошибка при входе.");
    }
  };

  const image = require("../images/directions/2D.png");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          marginTop: "80px",
          left: 0,
          bottom: "60px", // Отступ снизу
          display: isMobile ? "none" : "flex",
          width: "50%",
          height: "calc(100% - 140px)", // Высота с учетом отступов сверху и снизу
        }}
      >
        <img
          src={image}
          alt="Login visual"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
      <div
        style={{
          width: "50%",
          height: "100%",
          display: isMobile ? "none" : "flex",
        }}
      ></div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center", // Выровнять по правому краю
          width: isMobile ? "100%" : "50%", // Правая половина экрана
          height: "100%",
        }}
      >
        <div
          className="h4"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", // Выровнять по правому краю
            width: "260px",
            marginTop: isMobile ? "36px" : "50px",
            textAlign: "center",
          }}
        >
          Добро пожаловать в Anirum
        </div>
        <div
          className="Body-1"
          style={{
            fontSize: "14px",
            marginTop: "20px",
            width: "200px",
            textAlign: "center",
          }}
        >
          Создавайте миры вместе с нами
        </div>
        <form
          onSubmit={onSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center", // Выровнять по правому краю
            width: "250px",
            textAlign: "center",
          }}
        >
          <div
            className="input_default_border"
            style={{
              width: "100%",
            }}
          >
            <input
              className="input_default"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="identifier"
              required
            />
          </div>
          <div className="input_default_border" style={{ width: "100%" }}>
            <input
              className="input_default"
              placeholder="Password"
              style={{ marginLeft: "25px" }}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div
              onClick={togglePasswordVisibility}
              style={{ marginRight: "8px", cursor: "pointer" }}
            >
              {showPassword ? (
                <EyeOn style={{ width: "20px", height: "20px" }} />
              ) : (
                <EyeOff style={{ width: "20px", height: "20px" }} />
              )}
            </div>
          </div>
          <button
            type="submit"
            className="button Body-2 button-animate-filter"
            style={{ width: "100%", marginTop: "16px" }}
            disabled={isLoading}
          >
            {isLoading ? "Загрузка..." : "Войти"}
          </button>
        </form>
        <div className="Body-3" style={{ marginTop: "16px" }}>
          или
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column", // Обеспечивает выравнивание элементов по горизонтали
            justifyContent: "space-between",
            alignItems: "center", // Выравнивание элементов по центру по вертикали
            width: "250px",
            marginTop: "16px",
          }}
        >
          <AuthDiscord />
          <AuthGoogle />
        </div>
        <div
          className="Body-2"
          style={{
            display: "flex",
            flexDirection: "column", // Располагаем элементы по вертикали
            justifyContent: "center",
            alignItems: "center",
            width: "250px",
            marginTop: "16px",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          <p style={{ lineHeight: "1.5" }}>
            Еще не зарегистрировались в Anirum?{" "}
            <Link
              to="/signup"
              style={{
                color: "black",
                textDecoration: "underline",
              }}
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
