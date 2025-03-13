import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Create } from "../images/Create.svg";
import {
  useGetGuidesQuery,
  useSaveGuideMutation,
} from "../redux/services/guidesAPI";
import {
  useFetchPinsQuery,
  useSavePinterestGuideMutation,
} from "../redux/services/pinterestApi";
import { Skeleton, Checkbox } from "@mui/material";
import { useMediaQuery } from "react-responsive";
import GuidesSearchMobileModal from "../components/Guides/GuidesSearchMobileModal";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsInitialized,
} from "../redux/reducers/authReducer";
import PinterestLogin from "./PinterestLogin";
import { toast } from "react-toastify";

const LOCAL_STORAGE_KEY = "recentQueries";
const DEFAULT_QUERIES = ["Формы", "Как рисовать голову"];

const industries = [
  "Формы",
  "Перспектива",
  "Тени",
  "Тело",
  "Голова",
  "Одежда",
  "Руки и Ноги",
  "Позы",
  "Анатомия",
  "Дизайн персонажей",
  "Стили",
  "Животные",
  "Дизайн существ",
  "Эмоции",
  "Продвинутая анатомия",
  "Дизайн реквизита",
  "Колористика",
  "Дизайн окружающей среды",
  "Композиция",
  "Сторитейлинг",
  "Визуализация",
];

// Объект для перевода запроса с русского на английский
const queryMapping = {
  Формы: "forms",
  Перспектива: "perspective",
  Тени: "shadows",
  Тело: "body",
  Голова: "head",
  Одежда: "clothes",
  "Руки и Ноги": "limbs",
  Позы: "poses",
  Анатомия: "anatomy",
  "Дизайн персонажей": "character design",
  Стили: "styles",
  Животные: "animals",
  "Дизайн существ": "creature design",
  Эмоции: "emotions",
  "Продвинутая анатомия": "advanced anatomy",
  "Дизайн реквизита": "prop design",
  Колористика: "color theory",
  "Дизайн окружающей среды": "environment design",
  Композиция: "composition",
  Сторитейлинг: "storytelling",
  Визуализация: "visualization",
  "Как рисовать голову": "how to draw a head",
};

export default function Guides() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentQueries, setRecentQueries] = useState(DEFAULT_QUERIES);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsInitialized);
  const [savePinterestGuide] = useSavePinterestGuideMutation();
  const [approved, setApproved] = useState(false);

  // Новый стейт для выбранных тегов (только для Pinterest)
  const [selectedPinTags, setSelectedPinTags] = useState([]);
  // Новый стейт для оптимистичного обновления кнопки сохранения пинов
  const [savedPins, setSavedPins] = useState([]);
  const ManagerId = process.env.REACT_APP_MANAGER;

  // Функция для переключения выбора тега
  const togglePinTag = (tag) => {
    if (selectedPinTags.includes(tag)) {
      setSelectedPinTags(selectedPinTags.filter((t) => t !== tag));
    } else {
      setSelectedPinTags([...selectedPinTags, tag]);
    }
  };

  // Дебаунс ввода (500 мс)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Если для запроса есть перевод — используем его, иначе оставляем исходное значение
  const translatedQuery = queryMapping[debouncedQuery] || debouncedQuery;

  // Если выбран запрос «Пины с Pinterest», будем работать с Pinterest API
  const isPinterestSearch = translatedQuery === "Пины с Pinterest";

  // Если не Pinterest – запрашиваем гайды
  const { data, error, isLoading, isFetching } = useGetGuidesQuery({
    search: isPinterestSearch ? "" : translatedQuery,
    userId: user?.id,
  });
  const guides = data?.data || [];

  // Если выбран Pinterest-запрос, то выполняем запрос пинов (если пользователь авторизован)
  const {
    data: pinsData,
    error: pinsError,
    isLoading: pinsLoading,
    isSuccess: pinsSuccess,
  } = useFetchPinsQuery(undefined, {
    skip: !isInitialized || !isPinterestSearch,
  });

  // Количество скелетонов
  const skeletonCount = isMobile ? 5 : 40;
  const skeletons = Array.from(new Array(skeletonCount)).map((_, index) => (
    <div key={index} className="gallery-item">
      <Skeleton
        variant="rectangular"
        sx={{ borderRadius: "8px" }}
        height={Math.floor(Math.random() * (350 - 150 + 1)) + 150}
      />
    </div>
  ));

  // Загрузка/сохранение недавних запросов в localStorage
  useEffect(() => {
    const storedQueries = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedQueries) {
      setRecentQueries(JSON.parse(storedQueries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentQueries));
  }, [recentQueries]);

  // Обработка клика по запросу/тегу
  const handleQueryClick = (query) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    if (trimmedQuery && !recentQueries.includes(trimmedQuery)) {
      setRecentQueries([trimmedQuery, ...recentQueries]);
    }
    setShowSearchSuggestions(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  // Обработка нажатия Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery && !recentQueries.includes(trimmedQuery)) {
        setRecentQueries([trimmedQuery, ...recentQueries]);
      }
      setShowSearchSuggestions(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  // Закрытие подсказок при клике вне области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSearchSuggestions(false);
      }
    };
    const handleScroll = () => {
      setShowSearchSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Функция сохранения гайда (для обычных работ)
  const [saveGuide] = useSaveGuideMutation();
  const handleSaveClick = (e, guide) => {
    e.preventDefault();
    if (!user) return;
    const isSaved = guide?.attributes?.savedBy?.data?.some(
      (savedUser) => savedUser.id === user?.id
    );
    const action = isSaved ? "unsave" : "save";
    saveGuide({ guideId: guide.id, userId: user.id, action });
  };

  // Функция сохранения пина в anirum с выбранными тегами на английском
  // Функция сохранения пина в anirum с выбранными тегами на английском
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
      console.log(approved, "approved");
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
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* Модалка поиска для мобильных устройств */}
      {isMobile && showMobileModal && (
        <GuidesSearchMobileModal
          onClose={() => setShowMobileModal(false)}
          setParentSearchQuery={(q) => setSearchQuery(q)}
          industries={industries}
          DEFAULT_QUERIES={DEFAULT_QUERIES}
        />
      )}

      <div
        style={{
          maxWidth: "900px",
          width: "100%",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
        ref={containerRef}
      >
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            placeholder="Поиск"
            className="input_with_icon Body-3"
            style={{
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            ref={inputRef}
            value={searchQuery}
            readOnly={isMobile}
            onChange={
              !isMobile ? (e) => setSearchQuery(e.target.value) : undefined
            }
            onKeyDown={!isMobile ? handleKeyDown : undefined}
            onFocus={
              isMobile
                ? () => setShowMobileModal(true)
                : () => setShowSearchSuggestions(true)
            }
            onClick={isMobile ? () => setShowMobileModal(true) : undefined}
          />

          {/* Подсказки для десктопа */}
          {!isMobile && showSearchSuggestions && (
            <div className="search-suggestions">
              <div className="Body-3" style={{ marginBottom: "12px" }}>
                Недавние поисковые запросы
              </div>
              <div className="search-tags" style={{ marginBottom: "16px" }}>
                {recentQueries.map((query, index) => (
                  <span
                    key={index}
                    className="Body-3"
                    onClick={() => handleQueryClick(query)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {query}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setRecentQueries(
                          recentQueries.filter((_, i) => i !== index)
                        );
                      }}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
              <div className="Body-3" style={{ marginBottom: "12px" }}>
                Интересное
              </div>
              <div className="search-tags" style={{ marginBottom: "16px" }}>
                {["Сохраненные", "Созданные гайды", "Пины с Pinterest"].map(
                  (item, i) => (
                    <span
                      key={i}
                      className="Body-3"
                      onClick={() => handleQueryClick(item)}
                      style={{ cursor: "pointer", marginRight: "8px" }}
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
              <div className="Body-3" style={{ marginBottom: "12px" }}>
                Теги
              </div>
              <div className="search-tags">
                {industries.map((item, index) => (
                  <span
                    key={index}
                    className="Body-3"
                    onClick={() => handleQueryClick(item)}
                    style={{ cursor: "pointer", marginRight: "8px" }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <Link
          to="/create/guide"
          className="button-create"
          style={{
            marginLeft: "12px",
            padding: 0,
            borderRadius: "50%",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Create />
        </Link>
      </div>

      {/* Если выбран Pinterest-поиск, отображаем блок для выбора тегов */}
      {isPinterestSearch && (
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
      )}

      <div className="gallery">
        {/* Если выбран запрос Pinterest */}
        {isPinterestSearch && pinsLoading && skeletons}
        {isPinterestSearch && pinsError && (
          <div>Ошибка при загрузке пинов: {pinsError.message}</div>
        )}
        {isPinterestSearch &&
          pinsSuccess &&
          pinsData &&
          pinsData.items &&
          pinsData.items.length > 0 &&
          pinsData.items.map((pin) => {
            // Объединяем оптимистичное состояние и ответ от бэкенда
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

        {isPinterestSearch &&
          pinsSuccess &&
          (!pinsData || !pinsData.items || pinsData.items.length === 0) && (
            <div style={{ marginTop: "16px" }}>
              <PinterestLogin />
            </div>
          )}

        {/* Если выбран обычный запрос – отображаем гайды */}
        {!isPinterestSearch && (isLoading || isFetching) && skeletons}
        {!isPinterestSearch && !isLoading && error && (
          <div className="Body-3">Ошибка при загрузке гайдов</div>
        )}
        {!isPinterestSearch &&
          guides.map((guide) => {
            const imageUrl =
              guide?.attributes?.image?.data?.attributes?.formats?.medium?.url;
            const isSaved = guide?.attributes?.savedBy?.data?.some(
              (savedUser) => savedUser.id === user?.id
            );
            return (
              <div
                key={guide.id}
                className="gallery-item"
                style={{ position: "relative" }}
              >
                {imageUrl && (
                  <>
                    <Link to={`/guide/${guide.id}`}>
                      <img
                        src={imageUrl}
                        alt={guide.attributes.title || "Guide Image"}
                        className="gallery-image"
                      />
                    </Link>
                    <button
                      className="save-button button Body-3 button-animate-filter"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: isSaved && "black",
                      }}
                      onClick={(e) => handleSaveClick(e, guide)}
                    >
                      {isSaved ? "Сохранено" : "Сохранить"}
                    </button>
                  </>
                )}
              </div>
            );
          })}
      </div>

      {/* Сообщение, если гайды не найдены (для обычного поиска) */}
      {!isPinterestSearch && !isLoading && guides.length === 0 && (
        <div style={{ width: "100%" }}>
          <div className="h4" style={{ width: "100%", fontSize: "24px" }}>
            Нет подходящих гайдов
          </div>
          <div
            className="Body-2"
            style={{ width: "100%", fontSize: "20px", marginTop: "16px" }}
          >
            Попробуйте добавить гайды или удалить некоторые фильтры
          </div>
        </div>
      )}
    </div>
  );
}
