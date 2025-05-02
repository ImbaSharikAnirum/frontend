import React, { useRef, useState, useEffect } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { ReactComponent as Check } from "../../images/check.svg";

export default function DirectionSelect({ onSelect, selectedDirection }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const directions = ["Скетчинг", "2D рисование"];

  const closeFilterModal = () => {
    setIsModalOpen(false);
  };

  const handleDirectionSelect = (direction) => {
    onSelect(direction);
    closeFilterModal();
  };

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest(".direction-select")
      ) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="input_default_border direction-select"
      style={{
        width: "fit-content",
        alignItems: "flex-start",
        marginTop: "8px",
        display: "inline-block",
        maxWidth: "180px",
      }}
    >
      <input
        readOnly
        className="input_default"
        placeholder="Направление"
        value={selectedDirection || ""}
        onClick={handleModalToggle}
        style={{
          width: "100%",
          textAlign: "center",
          fontSize: "16px",
          fontFamily: "Nunito Sans",
          fontWeight: 400,
          cursor: "pointer",
          color: selectedDirection ? "#333" : "#999",
          background: "transparent",
          padding: "0 20px",
          boxSizing: "border-box",
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
            minWidth: "100%",
            zIndex: 1000,
            backgroundColor: "#fff",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
            borderRadius: "12px",
            padding: "12px",
            overflowY: "auto",
            maxHeight: "150px",
            marginTop: "8px",
          }}
        >
          <ul
            className="teacher-list Body-2"
            style={{
              listStyleType: "none",
              padding: 0,
              margin: 0,
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            {directions.map((direction, index) => (
              <li
                key={index}
                onClick={(event) => {
                  event.stopPropagation();
                  handleDirectionSelect(direction);
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`city-list-item ${
                  index === hoveredIndex ? "hovered" : ""
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "8px",
                  height: "20px",
                  backgroundColor:
                    index === hoveredIndex ? "#E9E9E9" : "transparent",
                }}
              >
                <div
                  className="Body-3"
                  style={{
                    marginLeft: "16px",
                    fontSize: "16px",
                    color: "#333",
                  }}
                >
                  {direction}
                </div>
                {direction === selectedDirection && (
                  <Check
                    style={{
                      marginRight: "16px",
                    }}
                  />
                )}
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
              <div className="h5">Настройки</div>
              <ul
                className="teacher-list Body-2"
                style={{
                  listStyleType: "none",
                  padding: "24px 0px",
                  margin: 0,
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                {directions.map((direction, index) => (
                  <li
                    key={index}
                    onClick={() => handleDirectionSelect(direction)}
                    className={`city-list-item ${
                      direction === selectedDirection ? "selected" : ""
                    }`}
                    style={{
                      padding: "12px",
                      cursor: "pointer",
                      borderRadius: "8px",
                      justifyContent: "space-between",
                      backgroundColor:
                        direction === selectedDirection
                          ? "#E9E9E9"
                          : "transparent",
                    }}
                  >
                    <div
                      className="Body-3"
                      style={{
                        marginLeft: "16px",
                        fontSize: "16px",
                        color: "#333",
                      }}
                    >
                      {direction}
                    </div>

                    {direction === selectedDirection && (
                      <Check
                        style={{
                          marginRight: "16px",
                        }}
                      />
                    )}
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
