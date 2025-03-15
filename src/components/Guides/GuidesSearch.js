import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Create } from "../../images/Create.svg";
import { useMediaQuery } from "react-responsive";
import GuidesSearchMobileModal from "./GuidesSearchMobileModal";

function GuidesSearch({
  searchQuery,
  setSearchQuery,
  recentQueries,
  handleQueryClick,
  handleKeyDown,
  isMobile,
  showMobileModal,
  setShowMobileModal,
  showSearchSuggestions,
  setShowSearchSuggestions,
  industries,
  DEFAULT_QUERIES,
  user,
  handleRemoveRecentQuery, // Получаем функцию удаления из родительского компонента
}) {
  const containerRef = useRef(null);
  const inputRef = useRef(null);

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
  }, [setShowSearchSuggestions]);

  return (
    <>
      {isMobile && showMobileModal && (
        <GuidesSearchMobileModal
          onClose={() => setShowMobileModal(false)}
          setParentSearchQuery={setSearchQuery}
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
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {user && (
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
        )}
      </div>
    </>
  );
}

export default GuidesSearch;
