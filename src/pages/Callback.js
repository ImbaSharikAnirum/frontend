import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setPinterestToken } from "../redux/reducers/authReducer";

const Callback = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      axios
        .post("https://anirum.up.railway.app/api/pinterest/auth", { code }) // Укажите ваш backend URL
        .then((response) => {
          const { access_token, message } = response.data;

          if (access_token) {
            dispatch(setPinterestToken({ token: access_token })); // Сохраняем токен в Redux
            console.log(message); // Выводим сообщение из ответа сервера
          } else {
            setError("Токен не получен");
            console.error("Токен не получен");
          }
        })
        .catch((error) => {
          setError("Ошибка при получении токена");
          console.error("Ошибка при получении токена: ", error);
        })
        .finally(() => {
          setLoading(false); // Завершаем загрузку
        });
    } else {
      setError("Отсутствует код авторизации");
      setLoading(false); // Завершаем загрузку, если код отсутствует
    }
  }, [dispatch]);

  if (loading) {
    return <div>Загрузка...</div>; // Состояние загрузки
  }

  if (error) {
    return <div>Ошибка: {error}</div>; // Ошибка
  }

  return <div>Успешно авторизовались через Pinterest!</div>;
};

export default Callback;
