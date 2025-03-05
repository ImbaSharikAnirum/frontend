import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  selectCurrentUser,
  setPinterestToken,
} from "../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const user = useSelector(selectCurrentUser);
  console.log(user, "user");

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    // Запрос выполняется только если и код, и user существуют
    if (code && user) {
      axios
        .post("https://anirum.up.railway.app/api/pinterest/auth", {
          code,
          userId: user?.id,
        }) // Укажите ваш backend URL
        .then((response) => {
          const { access_token } = response.data;

          if (access_token) {
            localStorage.setItem("pinterestAccessToken", access_token); // Сохраняем токен в localStorage
            console.log("Pinterest токен получен успешно");
            navigate("/pinterest"); // Перенаправление на страницу пинов
          } else {
            setError("Токен не получен");
            console.error("Токен не получен");
          }
        })
        .catch((error) => {
          setError("Ошибка при получении токена");
          console.error("Ошибка при получении токена: ", error);
        });
    } else {
      if (!code) {
        setError("Отсутствует код авторизации");
      }
      if (!user) {
        setError("Данные пользователя не загружены");
      }
    }
  }, [user, navigate]); // Запрос будет выполняться, когда user и code будут доступны

  if (error) {
    return <div>Ошибка: {error}</div>; // Ошибка
  }

  return <div>Успешно авторизовались через Pinterest!</div>; // Успешная авторизация
};

export default Callback;
