import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/services/authAPI";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser, setUser } from "../../redux/reducers/authReducer";
import { ReactComponent as EyeOff } from "../../images/eye_off.svg";
import { ReactComponent as EyeOn } from "../../images/eye_on.svg";
import { Link } from "react-router-dom";

import AuthDiscord from "../../components/AuthButton/AuthDiscord";
import AuthGoogle from "../../components/AuthButton/AuthGoogle";
import { toast } from "react-toastify";
import { useMediaQuery, useTheme } from "@mui/material";
import { useGetStudentsByUserIdQuery } from "../../redux/services/studentAPI";
import {
  selectAllStudents,
  setStudents,
} from "../../redux/reducers/studentReducer";

export default function LoginBooking() {
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
      // navigate(`/`);
      toast.success("Вы успешно вошли в систему!");
    } catch (error) {
      console.error("Failed to login:", error);
      toast.error("Произошла ошибка при входе.1");
    }
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
    </div>
  );
}
