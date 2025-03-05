import React, { useEffect, useState } from "react";
import axios from "axios";

const PinterestPins = () => {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("pinterestAccessToken");

    if (token) {
      axios
        .get("https://api.pinterest.com/v5/me/pins", {
          headers: {
            Authorization: `Bearer ${token}`, // Отправляем токен для авторизации
          },
        })
        .then((response) => {
          setPins(response.data.data); // Сохраняем пины в состояние
          console.log(response, "response");
          setLoading(false); // Останавливаем индикатор загрузки
        })
        .catch((error) => {
          setError("Ошибка при загрузке пинов");
          setLoading(false);
          console.error("Ошибка при получении пинов: ", error);
        });
    } else {
      setError("Токен не найден");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Загрузка пинов...</div>; // Индикатор загрузки
  }

  if (error) {
    return <div>{error}</div>; // Ошибка
  }

  return (
    <div>
      <h1>Мои пины</h1>
      {pins.length > 0 ? (
        <ul>
          {pins.map((pin) => (
            <li key={pin.id}>
              <img src={pin.image.original.url} alt={pin.title} />
              <p>{pin.title}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Пины не найдены</p>
      )}
    </div>
  );
};

export default PinterestPins;
