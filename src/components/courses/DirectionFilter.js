import React, { useRef, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDirection, clearDirection } from "../../redux/filterSlice";
import "../../styles/courses.css";
import "../../styles/dropdown.css";
import { Skeleton } from "@mui/material";

const directionsList = [
  {
    name: "Скетчинг",
    imgSrc: require("../../images/directions/scetching.jpg"),
  },
  {
    name: "2D Рисование",
    imgSrc: require("../../images/directions/2D.png"),
  },
  {
    name: "3D Моделирование",
    imgSrc: require("../../images/directions/3D.png"),
  },
  {
    name: "Анимация",
    imgSrc: require("../../images/directions/Animation.jpg"),
  },
];

export default function DirectionFilter({ loading }) {
  const dispatch = useDispatch();
  const { direction } = useSelector((state) => state.filter);

  const [isDirectionsOpen, setIsDirectionsOpen] = useState(false);
  const directionsRef = useRef(null);

  const handleDirectionSelect = useCallback(
    (selectedDirection) => {
      dispatch(setDirection(selectedDirection));
      setIsDirectionsOpen(false);
    },
    [dispatch]
  );

  const toggleDirections = useCallback(() => {
    setIsDirectionsOpen((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (!directionsRef.current?.contains(event.target)) {
      setIsDirectionsOpen(false);
    }
  }, []);

  const handleClearDirection = () => {
    dispatch(clearDirection());
  };

  useEffect(() => {
    if (isDirectionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDirectionsOpen, handleClickOutside]);

  return (
    <div className="filter-direction-container">
      {loading ? (
        <button
          className="button_tertiary Body-3"
          style={{ height: "56px", width: "160px" }}
        >
          <Skeleton
            variant="rectangular"
            width={"100%"}
            // height={36}
            sx={{ borderRadius: "8px" }} // Скругляем углы
          />
        </button>
      ) : (
        <button
          className="button_tertiary Body-3"
          onClick={toggleDirections}
          style={{ height: "56px" }}
        >
          {direction ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontSize: 10, color: "black" }}>Направление</div>
                <div>{direction}</div>
              </div>
              <span
                className="remove-direction"
                onClick={handleClearDirection}
                style={{ width: "40px", marginRight: "-15px" }}
              >
                ✕
              </span>
            </div>
          ) : (
            "Направления"
          )}
        </button>
      )}
      {isDirectionsOpen && (
        <div className="dropdown" ref={directionsRef}>
          <div className="dropdown-header">
            <div className="h5">Доступные направления</div>
          </div>
          <div className="dropdown-content">
            {directionsList.map((dir, index) => (
              <div
                key={index}
                className="direction"
                onClick={() => handleDirectionSelect(dir.name)}
              >
                <img src={dir.imgSrc} alt={dir.name} />
                <div className="Body-3">{dir.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
