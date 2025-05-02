import React, { useRef, useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import moment from "moment-timezone";
import { ReactComponent as Check } from "../../images/check.svg";

// Список основных часовых поясов для стран СНГ и UTC
const MAIN_TIMEZONES = [
  "UTC",
  "Europe/Moscow", // Москва, Санкт-Петербург (UTC+3)
  "Asia/Almaty", // Алматы, Астана (UTC+6)
  "Asia/Yakutsk", // Якутск (UTC+9)
  "Asia/Vladivostok", // Владивосток (UTC+10)
];

// Функция для форматирования названия часового пояса
const formatTimezoneName = (zoneName) => {
  const city = zoneName.split("/").pop().replace(/_/g, " ");
  const offset = moment.tz(zoneName).format("Z");
  return `${city} (GMT${offset})`;
};

// Сортировка часовых поясов по смещению UTC
const sortedTimezones = MAIN_TIMEZONES.sort((a, b) => {
  const offsetA = moment.tz(a).utcOffset();
  const offsetB = moment.tz(b).utcOffset();
  return offsetA - offsetB;
});

export default function TimezoneSelect({ onSelect, value }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const closeFilterModal = () => {
    setIsModalOpen(false);
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSelect = (timezone) => {
    onSelect(timezone);
    closeFilterModal();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest(".timezone-select")
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayValue = value ? formatTimezoneName(value) : "";

  return (
    <div
      className="input_default_border timezone-select"
      style={{
        width: "240px",
        alignItems: "flex-start",
        display: "inline-block",
        position: "relative",
      }}
    >
      <input
        readOnly
        className="input_default Body-2"
        placeholder="Часовой пояс"
        value={displayValue}
        onClick={handleModalToggle}
        style={{
          width: "100%",
          textAlign: "left",
          cursor: "pointer",
          color: displayValue ? "#333" : "#999",
          background: "transparent",
          padding: "0 20px",
          boxSizing: "border-box",
          height: "44px",
        }}
      />
      {!isMobile && isModalOpen && (
        <div
          className="modal"
          ref={modalRef}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            zIndex: 1000,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
            padding: "12px",
            overflowY: "auto",
            maxHeight: "300px",
            marginTop: "8px",
          }}
        >
          <ul
            className="timezone-list Body-2"
            style={{
              listStyleType: "none",
              padding: 0,
              margin: 0,
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            {sortedTimezones.map((timezone, index) => (
              <li
                key={index}
                onClick={() => handleSelect(timezone)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`timezone-list-item ${
                  index === hoveredIndex ? "hovered" : ""
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 16px",
                  cursor: "pointer",
                  borderRadius: "8px",
                  backgroundColor:
                    index === hoveredIndex
                      ? "#E9E9E9"
                      : value === timezone
                      ? "#E9E9E9"
                      : "transparent",
                }}
              >
                <div className="Body-3" style={{ color: "#333" }}>
                  {formatTimezoneName(timezone)}
                </div>
                {value === timezone && <Check />}
              </li>
            ))}
          </ul>
        </div>
      )}
      {isMobile && isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeFilterModal}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "8px 24px",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-filter" style={{ border: "none" }}>
              <button
                className="button_white modal-close-button"
                onClick={closeFilterModal}
                style={{
                  padding: 0,
                  borderRadius: "50%",
                  fontSize: "16px",
                  textAlign: "center",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <div className="h5" onClick={handleModalToggle}>
                  ✕
                </div>
              </button>
              <div className="h5">Часовой пояс</div>
              <ul
                className="timezone-list Body-2"
                style={{
                  listStyleType: "none",
                  padding: "24px 0px",
                  margin: 0,
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                {sortedTimezones.map((timezone, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(timezone)}
                    className={`timezone-list-item ${
                      value === timezone ? "selected" : ""
                    }`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      cursor: "pointer",
                      borderRadius: "8px",
                      backgroundColor:
                        value === timezone ? "#E9E9E9" : "transparent",
                    }}
                  >
                    <div className="Body-3" style={{ color: "#333" }}>
                      {formatTimezoneName(timezone)}
                    </div>
                    {value === timezone && <Check />}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
