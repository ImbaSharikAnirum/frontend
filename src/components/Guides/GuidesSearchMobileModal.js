import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { hideFooterMenu, showFooterMenu } from "../../redux/footerMenuSlice";
import { ReactComponent as Search } from "../../images/search.svg";

const LOCAL_STORAGE_KEY = "recentQueries";

export default function GuidesSearchMobileModal({
  onClose,
  setParentSearchQuery,
  industries,
  DEFAULT_QUERIES,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [recentQueries, setRecentQueries] = useState(DEFAULT_QUERIES);
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  // Скрываем футер при открытии модалки и возвращаем при закрытии
  useEffect(() => {
    dispatch(hideFooterMenu());
    return () => {
      dispatch(showFooterMenu());
    };
  }, [dispatch]);

  // Загружаем недавние запросы из localStorage при монтировании
  useEffect(() => {
    const storedQueries = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedQueries) {
      setRecentQueries(JSON.parse(storedQueries));
    }
  }, []);

  // Обновляем localStorage при изменении recentQueries
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(recentQueries));
  }, [recentQueries]);

  // Обработка нажатия Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addQueryAndClose(searchValue);
    }
  };

  const addQueryAndClose = (query) => {
    const trimmedQuery = query.trim();
    let newRecentQueries = recentQueries;
    if (trimmedQuery && !recentQueries.includes(trimmedQuery)) {
      newRecentQueries = [trimmedQuery, ...recentQueries];
      setRecentQueries(newRecentQueries);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRecentQueries));
    }
    if (setParentSearchQuery) {
      setParentSearchQuery(trimmedQuery);
    }
    onClose();
  };

  // Функция сброса данных поиска и закрытия модалки
  const handleResetAll = () => {
    setSearchValue("");
    if (setParentSearchQuery) {
      setParentSearchQuery("");
    }
    onClose();
  };

  // Удаление отдельного запроса из списка
  const handleRemoveRecentQuery = (index) => {
    const updatedQueries = recentQueries.filter((_, i) => i !== index);
    setRecentQueries(updatedQueries);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedQueries));
  };

  // Универсальная функция для клика по любому запросу (Недавние, Интересное, Отрасли)
  const handleQueryClick = (query) => {
    setSearchValue(query);
    addQueryAndClose(query);
  };

  // Закрытие модалки при клике вне её области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        padding: "0px 24px",
      }}
    >
      <div
        className="modal-content"
        ref={modalRef}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          backgroundColor: "white",
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Шапка модалки */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            borderBottom: "1px solid #ccc",
          }}
        >
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "24px",
              cursor: "pointer",
              marginRight: "8px",
            }}
          >
            ×
          </button>
          <input
            type="text"
            placeholder="Поиск"
            value={searchValue}
            className="input_with_icon Body-3"
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "16px",
              boxSizing: "border-box",
              fontSize: "16px",
            }}
          />
        </div>

        {/* Основная часть — скроллимый контейнер */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 16px 16px",
            marginTop: "16px",
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
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  cursor: "pointer",
                  marginRight: "8px",
                  marginBottom: "8px",
                  background: "#f0f0f0",
                  padding: "4px 8px",
                  borderRadius: "4px",
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
            {["Сохраненные", "Созданные гайды", "Пины с Pinterest"].map(
              (item, i) => (
                <span
                  key={i}
                  className="Body-3"
                  onClick={() => handleQueryClick(item)}
                  style={{
                    cursor: "pointer",
                    marginRight: "8px",
                    marginBottom: "8px",
                    background: "#f0f0f0",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    display: "inline-block",
                  }}
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
                style={{
                  cursor: "pointer",
                  marginRight: "8px",
                  marginBottom: "8px",
                  background: "#f0f0f0",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  display: "inline-block",
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Футер модалки с кнопками */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px",
            justifyContent: "space-between",
            borderTop: "1px solid #ccc",
          }}
        >
          <div
            className="Body-1"
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={handleResetAll}
          >
            Сбросить всё
          </div>
          <button
            className="button Body-3 button-animate-filter"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onClick={() => addQueryAndClose(searchValue)}
          >
            <Search
              style={{
                stroke: "#E60023",
                marginRight: "4px",
                height: "18px",
              }}
            />
            Искать
          </button>
        </div>
      </div>
    </div>
  );
}
