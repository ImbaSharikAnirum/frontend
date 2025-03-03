import React, { useEffect, useState } from "react";
import { ReactComponent as Search } from "../images/search.svg";
import { useSearchPinsQuery } from "../redux/services/guidesAPI";
import "../styles/guides.css";
import { Link } from "react-router-dom";
import { ReactComponent as Create } from "../images/Create.svg";

export default function Guides() {
  const [query, setQuery] = useState(""); // Текст запроса
  const [heights, setHeights] = useState([]); // Соотношения сторон изображений

  // Используем RTK Query для запроса данных
  const { data, isLoading, isError, error } = useSearchPinsQuery(query, {
    skip: query.trim() === "", // Пропускаем запрос, если строка пустая
  });

  // Проверяем, что API возвращает корректные данные
  const images = data?.items?.map((item) => item.image.original.url) || [];

  // Загрузка соотношений сторон изображений
  useEffect(() => {
    const loadImageRatios = async () => {
      const loadedRatios = await Promise.all(
        images.map((src) => {
          const img = new Image();
          img.src = src;
          return new Promise((resolve) => {
            img.onload = () => resolve(img.height / img.width);
            img.onerror = () => resolve(1); // На случай ошибки загрузки
          });
        })
      );
      setHeights(loadedRatios);
    };

    if (images.length > 0) {
      loadImageRatios();
    }
  }, [images]);

  // Обработчик ввода текста
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
        }}
      >
        <div className="teacher-search" style={{ width: "100%" }}>
          <Search className="icon" />
          <input
            type="text"
            placeholder="Поиск"
            className="input-search Body-2"
            style={{
              width: "100%",
              paddingLeft: "4px",
              fontSize: "16px",
            }}
            value={query}
            onChange={handleInputChange}
          />
        </div>
        <div style={{ paddingLeft: "8px" }}>
          <Link
            to="/create/guide"
            className="button_only_icon"
            style={{
              display: "flex",
              alignItems: "center",
              height: "40px",
              width: "25px",
            }}
          >
            <Create />
          </Link>
        </div>
      </div>

      {/* Отображение статуса запроса */}
      {isLoading && <p>Загрузка...</p>}
      {isError && (
        <p>Ошибка: {error?.data?.message || "Не удалось загрузить данные"}</p>
      )}

      {/* Отображение Masonry-сетки */}
      <div className="guides-masonry">
        {images.length > 0 &&
          images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Референс ${index}`}
              style={{
                gridRowEnd: `span ${Math.ceil(
                  ((heights[index] || 1) * 100) / 8
                )}`,
              }}
            />
          ))}
      </div>
    </div>
  );
}
