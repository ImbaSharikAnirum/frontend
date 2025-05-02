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
import { useTranslation } from "react-i18next";

// Данные городов и их районов с локализацией
const citiesWithDistricts = {
  ru: {
    Москва: ["Калужская", "Дмитровская", "Алтуфьево"],
    "Санкт-Петербург": ["Невский проспект", "Петроградская", "Адмиралтейская"],
    Якутск: [],
    Владивосток: ["Заря", "Светланская"],
    Астана: ["Алматинский", "Есильский", "Сарыаркинский"],
    Алматы: ["Алмалинский", "Ауэзовский", "Бостандыкский"],
  },
  en: {
    Moscow: ["Kaluzhskaya", "Dmitrovskaya", "Altufevo"],
    "Saint Petersburg": [
      "Nevsky Prospekt",
      "Petrogradskaya",
      "Admiralteyskaya",
    ],
    Yakutsk: [],
    Vladivostok: ["Zarya", "Svetlanskaya"],
    Astana: ["Almaty", "Esil", "Saryarka"],
    Almaty: ["Almaly", "Auezov", "Bostandyk"],
  },
};

// Маппинг отображаемых названий на значения для фильтрации
const cityFilterMapping = {
  en: {
    Moscow: "Moskva",
    "Saint Petersburg": "Sankt-Peterburg",
    Yakutsk: "Yakutsk",
    Vladivostok: "Vladivostok",
    Astana: "Astana",
    Almaty: "Almaty",
  },
  ru: {
    Москва: "Москва",
    "Санкт-Петербург": "Санкт-Петербург",
    Якутск: "Якутск",
    Владивосток: "Владивосток",
    Астана: "Астана",
    Алматы: "Алматы",
  },
};

// Маппинг значений для фильтрации на отображаемые названия
const cityDisplayMapping = {
  en: {
    Moskva: "Moscow",
    "Sankt-Peterburg": "Saint Petersburg",
    Yakutsk: "Yakutsk",
    Vladivostok: "Vladivostok",
    Astana: "Astana",
    Almaty: "Almaty",
  },
  ru: {
    Москва: "Москва",
    "Санкт-Петербург": "Санкт-Петербург",
    Якутск: "Якутск",
    Владивосток: "Владивосток",
    Астана: "Астана",
    Алматы: "Алматы",
  },
};

export default function FormatFilter({ loading }) {
  const dispatch = useDispatch();
  const { format, city, district } = useSelector((state) => state.filter);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [hoveredCityIndex, setHoveredCityIndex] = useState(null);

  const formatRef = useRef(null);
  const cityInputRef = useRef(null);

  // Инициализация значений из Redux
  useEffect(() => {
    if (city) {
      const cityValue =
        currentLanguage === "en" ? city.city_en : city.city_original_language;
      const displayCity =
        cityDisplayMapping[currentLanguage][cityValue] || cityValue;
      setSelectedCity(displayCity);
    }
    if (district) {
      setSelectedDistrict(
        currentLanguage === "en"
          ? district.district_en
          : district.district_original_language
      );
    }
  }, [city, district, currentLanguage]);

  const toggleFormat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleInputChange = (event) => {
    const value = event.target.value.trim();

    setSelectedCity(value);
    setSelectedDistrict("");
    setIsCitySelected(false);

    if (value) {
      const filtered = Object.entries(
        citiesWithDistricts[currentLanguage]
      ).reduce((acc, [city, districts]) => {
        const cityLowerCase = city.toLowerCase();
        if (cityLowerCase.includes(value.toLowerCase())) {
          acc.push(city);
          acc.push(...districts.map((district) => `${city}, ${district}`));
        } else {
          districts.forEach((district) => {
            if (district.toLowerCase().includes(value.toLowerCase())) {
              acc.push(`${city}, ${district}`);
            }
          });
        }
        return acc;
      }, []);

      setFilteredOptions(filtered.slice(0, 5));
    } else {
      setFilteredOptions([]);
    }
  };

  const handleOptionSelect = (option) => {
    const [city, district] = option.split(", ").map((str) => str.trim());

    // Получаем отображаемое название города
    const displayCity = cityDisplayMapping[currentLanguage][city] || city;
    setSelectedCity(displayCity);
    setSelectedDistrict(district || "");
    setFilteredOptions([]);

    // Получаем значения для фильтрации
    const cityForFilter =
      cityFilterMapping[currentLanguage][displayCity] || city;

    // Получаем значения на обоих языках
    const cityEn =
      currentLanguage === "en"
        ? cityForFilter
        : Object.keys(cityFilterMapping.en).find(
            (key) => cityFilterMapping.ru[key] === cityForFilter
          );
    const cityRu =
      currentLanguage === "ru"
        ? cityForFilter
        : Object.keys(cityFilterMapping.ru).find(
            (key) => cityFilterMapping.en[key] === cityForFilter
          );

    const districtEn = district
      ? citiesWithDistricts.en[city]?.includes(district)
        ? district
        : citiesWithDistricts.en[city]?.find(
            (d, i) => citiesWithDistricts.ru[city]?.[i] === district
          )
      : "";

    const districtRu = district
      ? citiesWithDistricts.ru[city]?.includes(district)
        ? district
        : citiesWithDistricts.ru[city]?.find(
            (d, i) => citiesWithDistricts.en[city]?.[i] === district
          )
      : "";

    // Отправляем локализованные значения в Redux
    dispatch(
      setCity({
        city_en: cityEn || cityForFilter,
        city_original_language: cityRu || cityForFilter,
      })
    );

    if (district) {
      dispatch(
        setDistrict({
          district_en: districtEn || district,
          district_original_language: districtRu || district,
        })
      );
    } else {
      dispatch(
        setDistrict({
          district_en: "",
          district_original_language: "",
        })
      );
    }

    dispatch(setFormat("Оффлайн"));
    setIsCitySelected(true);
    toggleFormat();
  };

  const handleFormatSelect = (selectedFormat) => {
    if (selectedFormat === "Онлайн") {
      dispatch(setFormat("Онлайн"));
      dispatch(
        setCity({
          city_en: "",
          city_original_language: "",
        })
      );
      dispatch(
        setDistrict({
          district_en: "",
          district_original_language: "",
        })
      );
      setSelectedCity("");
      setSelectedDistrict("");
      setFilteredOptions([]);
      setIsCitySelected(false);
    } else {
      dispatch(setFormat(selectedFormat));
      dispatch(
        setCity({
          city_en: "",
          city_original_language: "",
        })
      );
      dispatch(
        setDistrict({
          district_en: "",
          district_original_language: "",
        })
      );
      setSelectedCity("");
      setSelectedDistrict("");
      setFilteredOptions([]);
      setIsCitySelected(false);
    }
    toggleFormat();
  };

  const handleFormatRemove = () => {
    dispatch(clearFormat());
    setSelectedCity("");
    setSelectedDistrict("");
    setFilteredOptions([]);
    setIsCitySelected(false);
  };

  const handleClickOutside = useCallback((event) => {
    if (!formatRef.current?.contains(event.target)) {
      setIsOpen(false);
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
            sx={{ borderRadius: "8px" }}
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
                <div style={{ fontSize: 10, color: "black" }}>
                  {t("filters.format.title")}
                </div>
                <div>
                  {format === "Онлайн"
                    ? t("filters.format.online")
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
            t("filters.format.title")
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
            <div className="h5">{t("filters.format.select")}</div>
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
                {t("filters.format.online")}
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
                      placeholder={t("filters.location.placeholder")}
                      className="input_with_icon Body-3"
                      ref={cityInputRef}
                      style={{
                        border: isCitySelected ? "1px solid black" : "",
                        marginLeft: "22px",
                        width: "270px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
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
                    event.stopPropagation();
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
