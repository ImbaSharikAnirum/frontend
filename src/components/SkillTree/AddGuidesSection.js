import React, { useState, useEffect, useRef, useMemo } from "react";
import { Avatar, Skeleton } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { useSearchGuidesByTextQuery } from "../../redux/services/guidesAPI";
// import { useGetGuidesQuery } from "../../redux/services/guidesAPI";

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

export default function AddGuidesSection({ onAddNode }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [page, setPage] = useState(1);
  const [guides, setGuides] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [recentQueries, setRecentQueries] = useState(DEFAULT_QUERIES);

  const containerRef = useRef(null);
  const prevDebouncedQueryRef = useRef("");

  // Загружаем недавние запросы из localStorage
  useEffect(() => {
    const storedQueries = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedQueries) {
      setRecentQueries(JSON.parse(storedQueries));
    }
  }, []);

  // Сохраняем недавние запросы в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentQueries));
  }, [recentQueries]);

  // Сброс состояния при смене маршрута
  useEffect(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    setPage(1);
    setGuides([]);
    setHasMore(true);
    prevDebouncedQueryRef.current = "";
    setShowSearchSuggestions(false);
    const container = document.getElementById("sidebar-container");
    if (container) {
      container.scrollTop = 0;
    }
  }, [location]);

  // Дебаунс ввода (500 мс)
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    const timer = setTimeout(() => {
      if (trimmedQuery !== prevDebouncedQueryRef.current) {
        setDebouncedQuery(trimmedQuery);
        setPage(1);
        setGuides([]);
        setHasMore(true);
        prevDebouncedQueryRef.current = trimmedQuery;
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Закрытие подсказок при клике вне области и при скролле
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

  // Если для запроса есть сопоставление — используем его
  const translatedQuery = queryMapping[debouncedQuery] || debouncedQuery;
  const user = useSelector(selectCurrentUser);

  // Формируем аргументы запроса
  const queryArgs = useMemo(
    () => ({
      query: translatedQuery,
      userId: user?.id,
      page,
    }),
    [translatedQuery, user?.id, page]
  );

  const { data, isLoading, isFetching } = useSearchGuidesByTextQuery(
    queryArgs,
    {
      skip: !user?.id,
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  console.log(data, "data");
  console.log("🔍 translatedQuery:", translatedQuery);
  console.log("📦 queryArgs:", queryArgs);
  // Обновление списка гайдов при получении данных
  useEffect(() => {
    if (data) {
      const newData = data.results || data;
      if (newData && Array.isArray(newData)) {
        if (page === 1) {
          setGuides(newData);
        } else {
          setGuides((prev) => {
            const merged = [...prev, ...newData];
            return merged.filter(
              (item, index, self) =>
                index === self.findIndex((g) => g.id === item.id)
            );
          });
        }
        setHasMore(newData.length > 0);
      }
    }
  }, [data, page, translatedQuery]);

  const loadMore = () => {
    if (!isLoading && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // Обработка клика по запросу из блока подсказок
  const handleQueryClick = (query) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    setShowSearchSuggestions(false);

    if (trimmedQuery) {
      const updated = [
        trimmedQuery,
        ...recentQueries.filter((q) => q !== trimmedQuery),
      ].slice(0, 10);
      setRecentQueries(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    }

    setPage(1);
    setGuides([]);
    setHasMore(true);
  };
  const [hoveredGuideId, setHoveredGuideId] = useState(null);

  // Удаление запроса из списка недавних
  const handleRemoveRecentQuery = (index) => {
    const updatedQueries = recentQueries.filter((_, i) => i !== index);
    setRecentQueries(updatedQueries);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedQueries));
  };

  return (
    <div style={{ marginTop: "16px" }} ref={containerRef}>
      {/* Блок поиска с подсказками */}
      <div style={{ marginBottom: "16px", position: "relative" }}>
        <input
          type="text"
          placeholder="Поиск гайдов"
          className="input_with_icon Body-3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSearchSuggestions(true)}
          style={{
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        />
        {showSearchSuggestions && (
          <div
            className="search-suggestions"
            style={{
              marginTop: "12px",
              position: "absolute",
              top: "100%",
              // width: "285px",
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "12px",
              zIndex: 10,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
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
                    marginRight: "8px",
                  }}
                >
                  {query}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveRecentQuery(index);
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
              {["Сохраненные", "Созданные гайды"].map((item, i) => (
                <span
                  key={i}
                  className="Body-3"
                  onClick={() => handleQueryClick(item)}
                  style={{
                    cursor: "pointer",
                    marginRight: "8px",
                  }}
                >
                  {item}
                </span>
              ))}
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
                  style={{
                    cursor: "pointer",
                    marginRight: "8px",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Секция с бесконечным скроллом для гайдов */}
      <InfiniteScroll
        dataLength={guides.length}
        next={loadMore}
        hasMore={hasMore}
        scrollThreshold={0.9}
        scrollableTarget="sidebar-container"
        loader={
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", // ✅ адаптивно
              gap: "12px",
              justifyItems: "center",
              maxWidth: "100%", // ✅ не даст гриду вылезти
              boxSizing: "border-box",
            }}
          >
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                style={{
                  width: "70px",
                  height: "90px",
                  textAlign: "center",
                  backgroundColor: "#DDDDDD",
                  borderRadius: "8px",
                  padding: "8px",
                }}
              >
                <Skeleton
                  variant="circular"
                  width={60}
                  height={60}
                  sx={{ margin: "0 auto" }}
                />
                <Skeleton
                  variant="text"
                  width={60}
                  style={{ margin: "8px auto 0" }}
                />
              </div>
            ))}
          </div>
        }
        endMessage={
          guides.length > 0 && (
            <p style={{ textAlign: "center", padding: "16px" }}>
              Больше гайдов нет
            </p>
          )
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", // ✅ адаптивно
            gap: "12px",
            justifyItems: "center",
            maxWidth: "100%", // ✅ не даст гриду вылезти
            boxSizing: "border-box",
          }}
        >
          {guides.map((guide) => {
            const imageAttributes = guide?.image;
            const url =
              imageAttributes?.formats?.medium?.url ||
              imageAttributes?.formats?.small?.url ||
              imageAttributes?.url;
            if (!url) return null;
            return (
              <div
                key={guide.id}
                onMouseEnter={() => setHoveredGuideId(guide.id)}
                onMouseLeave={() => setHoveredGuideId(null)}
                style={{
                  width: "70px",
                  height: "90px",
                  textAlign: "center",
                  backgroundColor: "#DDDDDD",
                  borderRadius: "8px",
                  padding: "8px",
                }}
                onClick={() => onAddNode(guide)}
              >
                <Avatar
                  src={url}
                  alt={guide.title || "Guide"}
                  sx={{
                    width: 60,
                    height: 60,
                    margin: "0 auto",
                    border: "1px solid #CDCDCD",
                  }}
                />
                <div
                  className="Body-2"
                  style={{
                    fontSize: "14px",
                    marginTop: "8px",
                    whiteSpace: "nowrap",

                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {guide.title || "Без названия"}
                </div>
                {hoveredGuideId === guide.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "80px",
                      zIndex: 1000,
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "4px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    <img
                      src={url}
                      alt="preview"
                      style={{
                        width: "200px",
                        height: "auto",
                        borderRadius: "4px",
                        display: "block",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}
