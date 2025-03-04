import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setPinterestToken } from "../redux/reducers/authReducer";

const Callback = () => {
  const dispatch = useDispatch();

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
            console.error("Токен не получен");
            // Можно показать ошибку на UI
          }
        })
        .catch((error) => {
          console.error("Ошибка при получении токена: ", error);
          // Можете обработать ошибку на UI
        });
    }
  }, [dispatch]);

  return <div>Loading...</div>;
};

export default Callback;
