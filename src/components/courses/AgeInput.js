import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAge, clearAge } from "../../redux/filterSlice";
import "../../styles/inputs.css";
import { Skeleton } from "@mui/material";

export default function AgeInput({ loading }) {
  const dispatch = useDispatch();
  const { age } = useSelector((state) => state.filter);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const ageInputRef = useRef(null);

  const handleAgeClick = () => {
    if (ageInputRef.current) {
      ageInputRef.current.focus();
    }
  };

  const handleAgeChange = (event) => {
    const ageValue = event.target.value;
    dispatch(setAge(ageValue));

    // Очистка старого таймера, если он есть
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Установка нового таймера
    const newTimeout = setTimeout(() => {}, 500); // Задержка в 1 секунду

    setDebounceTimeout(newTimeout);
  };
  const handleClearAge = () => {
    dispatch(clearAge());
  };
  return (
    <>
      {loading ? (
        <div
          className="input_with_icon Body-3"
          style={{
            height: "56px",
            display: "flex",
            flexDirection: age && "column",
            alignItems: age ? "start" : "center",
            position: "relative",
            width: "120px",
          }}
        >
          <Skeleton
            variant="rectangular"
            width={"100%"}
            // height={36}
            sx={{ borderRadius: "8px" }} // Скругляем углы
          />
        </div>
      ) : (
        <div
          className="input_with_icon Body-3"
          style={{
            height: "56px",
            display: "flex",
            flexDirection: age && "column",
            alignItems: age ? "start" : "center",
            position: "relative",
            width: "120px",
          }}
          onClick={handleAgeClick}
        >
          {age && <div style={{ fontSize: 10, color: "black" }}>Возраст</div>}

          <div>
            <input
              type="number"
              value={age}
              onChange={handleAgeChange}
              placeholder="Возраст"
              className="input-age Body-3"
              style={{
                paddingRight: age ? "12px" : "0px",
                boxSizing: "border-box",
              }}
              ref={ageInputRef}
            />
          </div>
          {age && (
            <span
              className="clear-icon"
              style={{
                position: "absolute",
                right: "18px",
                cursor: "pointer",
                fontSize: "16px",
                color: "#757575",
              }}
              onClick={handleClearAge}
            >
              ✕
            </span>
          )}
        </div>
      )}
    </>
  );
}
