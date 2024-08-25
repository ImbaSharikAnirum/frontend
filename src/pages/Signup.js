import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../redux/services/authAPI";
import { setUser } from "../redux/reducers/authReducer";
import { useTheme, useMediaQuery } from "@mui/material";
import AuthDiscord from "../components/AuthButton/AuthDiscord";
import AuthGoogle from "../components/AuthButton/AuthGoogle";
import { toast } from "react-toastify";
import { ReactComponent as EyeOff } from "../images/eye_off.svg";
import { ReactComponent as EyeOn } from "../images/eye_on.svg";
import { Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const onSubmit = async (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const data = {
      username: username,
      email: email,
      password: password,
    };

    console.log("Submitting data:", data); // Логируем данные
    try {
      const response = await signup(data).unwrap();
      dispatch(setUser(response));
      console.log("Response:", response);
      localStorage.setItem("token", response.jwt || "");
      localStorage.setItem("user", JSON.stringify(response.user));

      navigate("/");

      toast.success("Вы успешно зарегистрировались!");
    } catch (error) {
      console.error("Failed to signup:", error);
      toast.error("Произошла ошибка при регистрации.");
    }
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const image = require("../images/art_signup.png");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              name="username"
              required
            />
          </div>
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
              name="email"
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
              autoComplete="new-password"
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
            {isLoading ? "Загрузка..." : "Зарегестрироваться"}
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
          <p style={{ margin: "0", lineHeight: "1.5" }}>
            Продолжая, вы соглашаетесь с положениями основных документов{" "}
            <Link
              to="/signup"
              style={{
                color: "black",
                textDecoration: "underline", // Подчеркнутый текст для ссылок
              }}
            >
              Условия предоставления услуг
            </Link>{" "}
            и{" "}
            <Link
              to="/confidentiality"
              style={{
                color: "black",
                textDecoration: "underline",
              }}
            >
              Политика конфиденциальности
            </Link>{" "}
            — и подтверждаете, что прочли их.
          </p>
          <p style={{ margin: "8px 0 0", lineHeight: "1.5" }}>
            Вы уже зарегестрировались в Anirum?{" "}
            <Link
              to="/login"
              style={{
                color: "black",
                textDecoration: "underline",
              }}
            >
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
