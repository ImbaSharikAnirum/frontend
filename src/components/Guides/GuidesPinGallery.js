import React, { useState, useEffect } from "react";
import { Skeleton, Checkbox } from "@mui/material";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMediaQuery } from "react-responsive";
import {
  useLazyFetchPinsQuery,
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
  const breakpointColumnsObj = { default: 7, 1100: 3, 700: 2, 500: 2 };
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const ManagerId = process.env.REACT_APP_MANAGER;
  const [approved, setApproved] = useState(false);
  const [selectedPinTags, setSelectedPinTags] = useState([]);
  const [savedPins, setSavedPins] = useState([]);

  // Локальные состояния для пинов и пагинации
  const [pins, setPins] = useState([]);
  const [bookmark, setBookmark] = useState(""); // начальный bookmark – пустая строка
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 50;

  // Используем ленивый запрос, чтобы подгружать следующую страницу по требованию
  const [
    fetchPins,
    { data: pinsData, error: pinsError, isFetching: pinsLoading },
  ] = useLazyFetchPinsQuery();

  // Первый запрос при инициализации компонента
  useEffect(() => {
    if (isInitialized && isPinterestSearch) {
      fetchPins({ bookmark: "", pageSize });
    }
  }, [isInitialized, isPinterestSearch, fetchPins]);

  // При получении данных добавляем пины в общий список и обновляем bookmark
  useEffect(() => {
    if (pinsData?.items) {
      setPins((prev) => [...prev, ...pinsData.items]);
      setBookmark(pinsData.bookmark || ""); // Если bookmark отсутствует, это сигнал о завершении
      setHasMore(!!pinsData.bookmark);
    }
  }, [pinsData]);

  // Функция подгрузки следующей страницы
  const fetchMorePins = () => {
    if (hasMore) {
      fetchPins({ bookmark, pageSize });
    }
  };

  const togglePinTag = (tag) => {
    setSelectedPinTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const [savePinterestGuide] = useSavePinterestGuideMutation();

  const handleSavePin = async (e, pin) => {
    e.preventDefault();
    if (!user) return;
    if (savedPins.includes(pin.id) || pin.isSaved) {
      toast.info("Гайд уже сохранён");
      return;
    }
    setSavedPins((prev) => [...prev, pin.id]);
    try {
      const imageUrl = pin.media?.images["1200x"]?.url;
      if (!imageUrl) throw new Error("Изображение пина недоступно");

      const title = pin.title || "Pinterest Pin";
      const englishTags = selectedPinTags.map(
        (tag) => queryMapping[tag] || tag
      );

      const requestData = {
        imageUrl,
        title,
        text: pin.description || "",
        link: `https://www.pinterest.com/pin/${pin.id}/`,
        tags: englishTags.length > 0 && englishTags,
        approved,
      };

      await savePinterestGuide(requestData).unwrap();
      toast.success("Гайд успешно сохранен!");
    } catch (error) {
      console.error("Ошибка при создании гайда:", error);
      toast.error("Ошибка при сохранении гайда");
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
              key={index}
              onClick={() => togglePinTag(tag)}
              style={{
                cursor: "pointer",
                padding: "4px 12px",
                borderRadius: "20px",
                backgroundColor: isSelected ? "black" : "#f0f0f0",
                color: isSelected ? "white" : "black",
              }}
              className="Body-2"
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

      <InfiniteScroll
        dataLength={pins.length}
        next={fetchMorePins}
        hasMore={hasMore}
        loader={<h4>Загрузка...</h4>}
        endMessage={<p>Все пины загружены.</p>}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {pins.map((pin) => {
            const isPinSaved = savedPins.includes(pin.id) || pin.isSaved;
            return (
              <div
                key={pin.id}
                className="gallery-item"
                style={{ position: "relative" }}
              >
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
      </InfiniteScroll>

      {pinsError && (
        <div style={{ width: "100%" }}>
          {user ? (
            <div>
              <div className="h4" style={{ fontSize: "24px" }}>
                Ошибка при загрузке пинов
              </div>
              <div
                className="Body-2"
                style={{ fontSize: "20px", marginTop: "16px" }}
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
                Чтобы выгрузить данные из Pinterest, пройдите регистрацию или
                вход
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
