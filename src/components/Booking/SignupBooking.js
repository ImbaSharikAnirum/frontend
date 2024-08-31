import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "../../redux/services/authAPI";
import { selectCurrentUser, setUser } from "../../redux/reducers/authReducer";
import { useTheme, useMediaQuery } from "@mui/material";
import AuthDiscord from "../../components/AuthButton/AuthDiscord";
import AuthGoogle from "../../components/AuthButton/AuthGoogle";
import { toast } from "react-toastify";
import { ReactComponent as EyeOff } from "../../images/eye_off.svg";
import { ReactComponent as EyeOn } from "../../images/eye_on.svg";
import { Link } from "react-router-dom";
import { useGetStudentsByUserIdQuery } from "../../redux/services/studentAPI";
import { selectAllStudents, setStudents } from "../../redux/reducers/studentReducer";

export default function SignupBooking() {
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

    try {
      const response = await signup(data).unwrap();
      dispatch(setUser(response));
      localStorage.setItem("token", response.jwt || "");
      localStorage.setItem("user", JSON.stringify(response.user));

      // navigate("/");
      toast.success("Вы успешно зарегистрировались!");
    } catch (error) {
      console.error("Failed to signup:", error);
      toast.error("Произошла ошибка при регистрации.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
      }}
    >
      <div
        className="h5"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center", // Выровнять по правому краю
          // width: "260px",
          marginTop: "32px",
        }}
      >
        Чтобы оформить бронирование, войдите или зарегистрируйтесь
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
    </div>
  );
}
