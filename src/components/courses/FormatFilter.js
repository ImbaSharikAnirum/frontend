import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFormat,
  clearFormat,
  setCity,
  setDistrict,
} from "../../redux/filterSlice";
import { ReactComponent as MapIcon } from "../../images/map.svg";
import "../../styles/dropdown.css";
import "../../styles/inputs.css";
import { Skeleton } from "@mui/material";

// Данные городов и их районов
const citiesWithDistricts = {
  Москва: ["Калужская", "Дмитровская", "Алтуфьево"],
  "Санкт-Петербург": [
    "м.Невский проспект",
    "м.Петроградская",
    "м.Адмиралтейская",
  ],
  Якутск: [],
  Владивосток: ["Заря", "Светланская"],
  Астана: ["Алматинский", "Есильский", "Сарыаркинский"],
  Алматы: ["Алмалинский", "Ауэзовский", "Бостандыкский"],
};

export default function FormatFilter({ loading }) {
  const dispatch = useDispatch();
  const { format, city } = useSelector((state) => state.filter);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(city);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [hoveredCityIndex, setHoveredCityIndex] = useState(null);

  const formatRef = useRef(null);
  const cityInputRef = useRef(null);

  const toggleFormat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleInputChange = (event) => {
    const value = event.target.value.trim();

    setSelectedCity(value);
    setSelectedDistrict("");
    setIsCitySelected(false);

    if (value) {
      const filtered = Object.entries(citiesWithDistricts).reduce(
        (acc, [city, districts]) => {
          const cityLowerCase = city.toLowerCase();
          if (cityLowerCase.includes(value.toLowerCase())) {
            acc.push(city); // Добавляем город
            acc.push(...districts.map((district) => `${city}, ${district}`)); // Добавляем районы города
          } else {
            districts.forEach((district) => {
              if (district.toLowerCase().includes(value.toLowerCase())) {
                acc.push(`${city}, ${district}`);
              }
            });
          }
          return acc;
        },
        []
      );

      setFilteredOptions(filtered.slice(0, 5));
    } else {
      setFilteredOptions([]);
    }
  };

  // В handleOptionSelect добавьте отправку выбранного района в Redux:
  const handleOptionSelect = (option) => {
    const [city, district] = option.split(", ").map((str) => str.trim());
    setSelectedCity(city);
    setSelectedDistrict(district || "");
    setFilteredOptions([]);

    dispatch(setCity(city));
    dispatch(setDistrict(district || "")); // Отправляем район, если он выбран

    dispatch(setFormat("Оффлайн"));
    setIsCitySelected(true);
    toggleFormat(); // Закрываем модалку после выбора
  };

  const handleFormatSelect = (selectedFormat) => {
    if (selectedFormat === "Онлайн") {
      dispatch(setFormat("Онлайн")); // Устанавливаем формат как "Онлайн"
      dispatch(setCity(""));
      setSelectedCity("");
      setSelectedDistrict("");
      setFilteredOptions([]);
      setIsCitySelected(false);
    } else {
      dispatch(setFormat(selectedFormat));
      dispatch(setCity(""));
      setSelectedCity("");
      setSelectedDistrict("");
      setFilteredOptions([]);
      setIsCitySelected(false);
    }
    toggleFormat(); // Закрытие модального окна после выбора формата
  };

  const handleFormatRemove = () => {
    dispatch(clearFormat());
    dispatch(setCity(""));
    dispatch(setDistrict(""));
    setSelectedCity("");
    setSelectedDistrict("");
    setFilteredOptions([]);
    setIsCitySelected(false);
  };

  const handleClickOutside = useCallback((event) => {
    if (!formatRef.current?.contains(event.target)) {
      setIsOpen(false); // Закрываем модалку при клике вне её
    }
  }, []);

  const handleCityHover = (index) => {
    setHoveredCityIndex(index);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  return (
    <div className="filter-direction-container" ref={formatRef}>
      {loading ? (
        <button
          className="button_tertiary Body-3"
          style={{ height: "56px", width: "120px" }}
        >
          <Skeleton
            variant="rectangular"
            width={"100%"}
            sx={{ borderRadius: "8px" }} // Скругляем углы
          />
        </button>
      ) : (
        <button
          className="button_tertiary Body-3"
          onClick={toggleFormat}
          style={{ height: "56px", width: "100%" }}
        >
          {format ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontSize: 10, color: "black" }}>Формат</div>
                <div>
                  {format === "Онлайн"
                    ? format
                    : selectedCity +
                      (selectedDistrict ? `, ${selectedDistrict}` : "")}
                </div>
              </div>
              <span
                className="remove-direction"
                onClick={handleFormatRemove}
                style={{ width: "40px", marginRight: "-15px" }}
              >
                ✕
              </span>
            </div>
          ) : (
            "Формат"
          )}
        </button>
      )}
      {isOpen && (
        <div
          className="dropdown"
          style={{
            transform: `translateX(-33%)`,
            width: "420px",
          }}
          ref={formatRef}
        >
          <div className="dropdown-header">
            <div className="h5">Выберите формат обучения</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <div>
              <button
                className="button_tertiary Body-3 button-animate-filter"
                onClick={() => handleFormatSelect("Онлайн")}
                style={{
                  border: format === "Онлайн" && `1px solid black`,
                  color: format === "Онлайн" ? "black" : "#757575",
                  height: "44px",
                }}
              >
                Онлайн
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <div className="filters">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minWidth: "300px",
                  }}
                >
                  <div>
                    <input
                      type="text"
                      value={
                        selectedCity +
                        (selectedDistrict ? `, ${selectedDistrict}` : "")
                      }
                      onChange={handleInputChange}
                      placeholder="Оффлайн - Выбрать город"
                      className="input_with_icon Body-3"
                      ref={cityInputRef}
                      style={{
                        border: isCitySelected ? "1px solid black" : "",
                        marginLeft: "22px",
                        width: "270px",
                        overflow: "hidden", // Обрезает содержимое, если оно не помещается
                        textOverflow: "ellipsis", // Добавляет многоточие в конце обрезанного текста
                        whiteSpace: "nowrap", // Предотвращает перенос текста на новую строку
                      }}
                    />

                    {selectedCity && (
                      <span
                        className="clear-icon"
                        style={{ width: "40px", marginRight: "-15px" }}
                        onClick={() => {
                          setSelectedCity("");
                          setSelectedDistrict("");
                          setFilteredOptions([]);
                          dispatch(clearFormat());
                          dispatch(setCity(""));
                          setIsCitySelected(false);
                        }}
                      >
                        ✕
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {filteredOptions.length > 0 && (
            <ul
              className="city-list Body-2"
              style={{
                marginTop: "16px",
              }}
            >
              {filteredOptions.map((option, index) => (
                <li
                  key={index}
                  onClick={(event) => {
                    event.stopPropagation(); // Останавливаем всплытие события
                    handleOptionSelect(option);
                  }}
                  onMouseEnter={() => handleCityHover(index)}
                  onMouseLeave={() => handleCityHover(null)}
                  className={`city-list-item ${
                    index === hoveredCityIndex ? "hovered" : ""
                  }`}
                >
                  <div
                    style={{
                      height: "35px",
                      width: "35px",
                      backgroundColor: "#D1D1D1",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MapIcon
                      style={{
                        height: "16px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginLeft: "16px",
                    }}
                  >
                    {option}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
