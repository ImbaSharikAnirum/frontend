import React, { useState } from "react";
import { Skeleton, Checkbox } from "@mui/material";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMediaQuery } from "react-responsive";
import {
  useFetchPinsQuery,
  useSavePinterestGuideMutation,
} from "../../redux/services/pinterestApi";
import { toast } from "react-toastify";
import PinterestLogin from "../../pages/PinterestLogin";

export default function GuidesPinGallery({
  industries,
  user,
  queryMapping,
  isInitialized,
  isPinterestSearch,
}) {
  const breakpointColumnsObj = {
    default: 7,
    1100: 3,
    700: 2,
    500: 1,
  };
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const ManagerId = process.env.REACT_APP_MANAGER;
  const [approved, setApproved] = useState(false);
  const [selectedPinTags, setSelectedPinTags] = useState([]);

  // Состояния, необходимые для сохранения пинов
  const [savedPins, setSavedPins] = useState([]);
  const [savePinterestGuide] = useSavePinterestGuideMutation();

  // Локальные состояния для пинов и пагинации
  const [pins, setPins] = useState([]);
  const [bookmark, setBookmark] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: pinsData,
    error: pinsError,
    isLoading: pinsLoading,
  } = useFetchPinsQuery(
    { bookmark },
    {
      skip: !isInitialized || !isPinterestSearch,
    }
  );

  // Функция для переключения выбора тега
  const togglePinTag = (tag) => {
    if (selectedPinTags.includes(tag)) {
      setSelectedPinTags(selectedPinTags.filter((t) => t !== tag));
    } else {
      setSelectedPinTags([...selectedPinTags, tag]);
    }
  };

  const handleSavePin = async (e, pin) => {
    e.preventDefault();
    if (!user) return;
    // Если пин уже сохранён, то выходим из функции
    if (savedPins.includes(pin.id) || pin.isSaved) {
      toast.info("Гайд уже сохранён");
      return;
    }
    // Оптимистично обновляем UI – сразу добавляем ID пина в список сохранённых
    setSavedPins((prev) => [...prev, pin.id]);
    try {
      // Получаем URL изображения пина
      const imageUrl = pin.media?.images["1200x"]?.url;
      if (!imageUrl) {
        alert("Изображение пина недоступно");
        return;
      }
      // Получаем заголовок, если отсутствует — задаём значение по умолчанию
      const title = pin.title || "Pinterest Pin";
      if (!title) {
        alert("Заголовок пина отсутствует");
        return;
      }

      // Преобразование выбранных тегов в английский вариант
      const englishTags = selectedPinTags.map(
        (tag) => queryMapping[tag] || tag
      );

      // Формируем данные для запроса, включая выбранные теги на английском
      const requestData = {
        imageUrl,
        title,
        text: pin.description || "",
        link: `https://www.pinterest.com/pin/${pin.id}/`,
        tags: englishTags.length > 0 ? englishTags.join(", ") : "Pinterest",
        approved: approved,
      };
      // Вызываем mutation для сохранения гайда через Strapi
      const result = await savePinterestGuide(requestData).unwrap();
      console.log("Гайд успешно создан:", result);
      // Дополнительная логика (например, уведомление или навигация) может быть добавлена здесь
    } catch (error) {
      console.error("Ошибка при создании гайда из пина:", error);
      alert("Ошибка при создании гайда из пина");
      // Если произошла ошибка – можно убрать пин из списка сохранённых
      setSavedPins((prev) => prev.filter((id) => id !== pin.id));
    }
  };

  return (
    <div>
      <div
        className="pin-tags-selector"
        style={{
          marginBottom: "16px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
        }}
      >
        <div className="Body-2">Укажите теги перед сохранением: </div>
        {industries.map((tag, index) => {
          const isSelected = selectedPinTags.includes(tag);
          return (
            <span
              className="Body-2"
              key={index}
              onClick={() => togglePinTag(tag)}
              style={{
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: "20px",
                backgroundColor: isSelected ? "black" : "#f0f0f0",
                color: isSelected ? "white" : "black",
              }}
            >
              {tag}
            </span>
          );
        })}
        {user?.role?.id === Number(ManagerId) && (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div className="Body-2">Статус доступа: </div>
            <Checkbox
              id="approved-checkbox"
              checked={approved}
              onChange={() => setApproved(!approved)}
              defaultChecked
            />

            <label
              htmlFor="approved-checkbox"
              className="Body-2"
              style={{ cursor: "pointer" }}
            >
              Одобрено
            </label>
          </div>
        )}
      </div>

      <div>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {pinsData &&
            pinsData.items &&
            pinsData.items.map((pin) => {
              const isPinSaved = savedPins.includes(pin.id) || pin.isSaved;
              return (
                <div key={pin.id} className="gallery-item">
                  <button
                    className="save-button button Body-3 button-animate-filter"
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "8px",
                      zIndex: 1,
                      backgroundColor: isPinSaved ? "black" : "",
                    }}
                    onClick={(e) => handleSavePin(e, pin)}
                  >
                    {isPinSaved ? "Сохранено" : "Сохранить в Anirum"}
                  </button>
                  <img
                    src={pin.media?.images?.["1200x"]?.url}
                    alt={pin.title}
                    className="gallery-image"
                  />
                </div>
              );
            })}

          {/* Добавляем скелетоны прямо сюда */}
          {pinsLoading &&
            Array.from({ length: isMobile ? 5 : 40 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="gallery-item">
                <Skeleton
                  variant="rectangular"
                  sx={{ borderRadius: "8px" }}
                  width="100%"
                  height={Math.floor(Math.random() * (350 - 150 + 1)) + 150}
                />
              </div>
            ))}
        </Masonry>
        {pinsError && (
          <div style={{ width: "100%" }}>
            {user ? (
              <div>
                <div className="h4" style={{ fontSize: "24px" }}>
                  Ошибка при загрузке пинов
                </div>
                <div
                  className="Body-2"
                  style={{
                    fontSize: "20px",
                    marginTop: "16px",
                  }}
                >
                  Попробуйте авторизоваться
                </div>
                <PinterestLogin />
              </div>
            ) : (
              <div>
                <div
                  className="h4"
                  style={{ fontSize: "24px", marginTop: "16px" }}
                >
                  Чтобы выгрузить данные из Pinterest пройдите регистрацию или
                  вход
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
