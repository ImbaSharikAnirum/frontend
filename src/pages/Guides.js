import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Create } from "../images/Create.svg";
import { useGetGuidesQuery } from "../redux/services/guidesAPI";
import { useFetchPinsQuery } from "../redux/services/pinterestApi";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsInitialized,
} from "../redux/reducers/authReducer";
import GuidesGallery from "../components/Guides/GuidesGallery";
import GuidesPinGallery from "../components/Guides/GuidesPinGallery";
import GuidesSearch from "../components/Guides/GuidesSearch";
import "../styles/gallery.css";
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
};

export default function Guides() {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentQueries, setRecentQueries] = useState(DEFAULT_QUERIES);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const user = useSelector(selectCurrentUser);
  const isInitialized = useSelector(selectIsInitialized);

  // Галерея
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Дебаунс ввода (500 мс)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

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
    // Сбрасываем массив гайдов и пагинацию сразу при выборе пункта
    setImages([]);
    setPage(1);
    setHasMore(true);
    if (trimmedQuery && !recentQueries.includes(trimmedQuery)) {
      setRecentQueries([trimmedQuery, ...recentQueries]);
    }
    setShowSearchSuggestions(false);
  };
  // Функция удаления запроса из recentQueries
  const handleRemoveRecentQuery = (index) => {
    const updatedQueries = recentQueries.filter((_, i) => i !== index);
    setRecentQueries(updatedQueries);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedQueries));
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
    }
  };

  // Если для запроса есть перевод — используем его, иначе оставляем исходное значение
  const translatedQuery = queryMapping[debouncedQuery] || debouncedQuery;
  const isPinterestSearch = translatedQuery === "Пины с Pinterest";

  // Отслеживаем текущий поисковый запрос с помощью ref
  const currentQueryRef = useRef(translatedQuery);

  // При изменении запроса сбрасываем галерею и обновляем ref
  useEffect(() => {
    currentQueryRef.current = translatedQuery;
    setImages([]);
    setPage(1);
    setHasMore(true);
  }, [translatedQuery, isPinterestSearch]);

  // запрашиваем гайды
  const { data, isLoading, isFetching } = useGetGuidesQuery(
    {
      search: isPinterestSearch ? "" : translatedQuery,
      userId: user?.id,
      page,
    },
    {
      skip: !isInitialized || isPinterestSearch,
      refetchOnMountOrArgChange: true,
    }
  );

  const loadMore = () => {
    if (!isLoading && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // Если выбран Pinterest-запрос, то выполняем запрос пинов (если пользователь авторизован)

  // Обновление галереи только если ответ соответствует текущему запросу
  useEffect(() => {
    if (data && data.data && currentQueryRef.current === translatedQuery) {
      if (page === 1) {
        setImages(data.data);
      } else {
        setImages((prevImages) => {
          // Фильтруем новые данные, исключая те, которые уже есть в prevImages
          const newUniqueImages = data.data.filter(
            (item) => !prevImages.some((prev) => prev.id === item.id)
          );
          return [...prevImages, ...newUniqueImages];
        });
      }
      setHasMore(data.data.length > 0);
    } else if (!data) {
      setHasMore(false);
    }
  }, [data, page, translatedQuery]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <GuidesSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        recentQueries={recentQueries}
        handleQueryClick={handleQueryClick}
        handleKeyDown={handleKeyDown}
        isMobile={isMobile}
        showMobileModal={showMobileModal}
        setShowMobileModal={setShowMobileModal}
        showSearchSuggestions={showSearchSuggestions}
        setShowSearchSuggestions={setShowSearchSuggestions}
        industries={industries}
        DEFAULT_QUERIES={DEFAULT_QUERIES}
        user={user}
        handleRemoveRecentQuery={handleRemoveRecentQuery} // Передаём функцию удаления
      />

      {isPinterestSearch ? (
        <div style={{ width: "100%" }}>
          <GuidesPinGallery
            industries={industries}
            user={user}
            queryMapping={queryMapping}
            isInitialized={isInitialized}
            isPinterestSearch={isPinterestSearch}
          />
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <GuidesGallery
            images={images}
            loadMore={loadMore}
            hasMore={hasMore}
            isLoading={isLoading}
            isFetching={isFetching}
            user={user}
          />
        </div>
      )}
    </div>
  );
}
