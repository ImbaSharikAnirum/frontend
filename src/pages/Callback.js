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
        .post("http://localhost:1337/pinterest/auth", { code }) // Укажите ваш backend URL
        .then((response) => {
          const { access_token } = response.data;
          dispatch(setPinterestToken({ token: access_token })); // Сохраняем токен в Redux
        })
        .catch((error) => {
          console.error("Ошибка при получении токена: ", error);
        });
    }
  }, [dispatch]);

  return <div>Loading...</div>;
};

export default Callback;
