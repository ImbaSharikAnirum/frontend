import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFilters,
  setFilterMobile,
  triggerSearch,
  setFilterGroupMobile,
  hideFooterMenu,
} from "../../redux/footerMenuSlice"; // Adjust the import path as needed
import {
  setDirection,
  setAge,
  setDistrict,
  setCity,
  setFormat,
} from "../../redux/filterSlice";
import { ReactComponent as Filter } from "../../images/Filter.svg";

import { ReactComponent as Search } from "../../images/search.svg";
import "../../styles/courses.css";
import "../../styles/dropdown.css";
import "../../styles/dropdown.css";
import "../../styles/inputs.css";
import { ReactComponent as MapIcon } from "../../images/map.svg";
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
export default function FilterMobile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  //
  const closeFilterModal = () => {
    setIsModalOpen(false);
    setFormatFilter("");
    setSelectedCity("");
    setIsCitySelected(false);
    setSelectedDistrict("");
    dispatch(setFilterMobile());
    setAgeFilter("");
  };

  useEffect(() => {
    const toggleBodyScroll = (disable) => {
      document.body.style.overflow = disable ? "hidden" : "auto";
    };

    toggleBodyScroll(isModalOpen);

    return () => toggleBodyScroll(false);
  }, [isModalOpen]);

  const [selectedDirection, setSelectedDirection] = useState(null); // Стейт для выбранного направления
  const [directionModal, setDirectionModal] = useState(true); // Стейт для выбранного направления
  const [formatModal, setFormatModal] = useState(false);
  const [ageModal, setAgeModal] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const cityInputRef = useRef(null);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [ageFilter, setAgeFilter] = useState("");
  const [hoveredCityIndex, setHoveredCityIndex] = useState(null);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [formatFilter, setFormatFilter] = useState("");

  const handleCityHover = (index) => {
    setHoveredCityIndex(index);
  };
  const handleDirectionSelect = (direction) => {
    setSelectedDirection(direction); // Устанавливаем выбранное направление в стейт
    setDirectionModal(false);
    setAgeModal(false);
    setFormatModal(false);
  };

  const handleResetFilters = () => {
    setDirectionModal(true);

    setSelectedDirection(null); // Сброс состояния выбранного направления
    setFormatFilter("");
    setFormatModal(false);
    setSelectedCity("");
    setFilteredOptions([]);
    setAgeFilter("");
    setSelectedDistrict("");
    setIsCitySelected(false);
    setAgeModal(false);
    dispatch(resetFilters());
  };

  const handleClickFormat = () => {
    setDirectionModal(false);
    setAgeModal(false);
    setFormatModal(true);
  };
  const handleAgeFormat = () => {
    setDirectionModal(false);
    setFormatModal(false);
    setAgeModal(true);
  };
  const handleFormatSelect = (selectedFormat) => {
    if (selectedFormat === "Онлайн") {
      setFormatFilter("Онлайн");
      setFormatModal(false);
      setSelectedCity("");
      setFilteredOptions([]);
      setAgeFilter("");
      setSelectedDistrict("");
      setIsCitySelected(false);
    } else {
      setFormatFilter("Оффлайн");
      setFilteredOptions([]);
      setSelectedDistrict("");
      setSelectedCity("");
      setAgeFilter("");
      setIsCitySelected(false);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value.trim();

    setSelectedCity(value);
    // setSelectedDistrict("");
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
  const handleOptionSelect = (option) => {
    const [city, district] = option.split(", ").map((str) => str.trim());
    setSelectedCity(city);
    setSelectedDistrict(district || "");
    setFilteredOptions([]);
    setFormatFilter("Оффлайн");
    setFormatModal(false);
    setIsCitySelected(true);
  };

  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const ageInputRef = useRef(null);

  const handleAgeChange = (event) => {
    const ageValue = event.target.value;
    // dispatch(setAge(ageValue));
    setAgeFilter(ageValue);
    // Очистка старого таймера, если он есть
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Установка нового таймера
    const newTimeout = setTimeout(() => {}, 500); // Задержка в 1 секунду

    setDebounceTimeout(newTimeout);
  };
  const handleClearAge = () => {
    // dispatch(clearAge());
    setAgeFilter("");
  };
  const handleAgeClick = () => {
    if (ageInputRef.current) {
      ageInputRef.current.focus();
    }
  };

  const resetClicked = useSelector((state) => state.footerMenu.resetClicked);
  useEffect(() => {
    if (resetClicked) {
      handleResetFilters();
    }
  });
  const searchClicked = useSelector((state) => state.footerMenu.searchClicked);
  useEffect(() => {
    if (searchClicked) {
      handleSearch();
    }
  });

  const handleSearch = () => {
    // Логика обработки поиска
    dispatch(setDirection(selectedDirection));
    dispatch(setAge(ageFilter));
    dispatch(setCity(selectedCity));
    dispatch(setDistrict(selectedDistrict || "")); // Отправляем район, если он выбран

    dispatch(setFormat(formatFilter));
    // Сброс состояния searchClicked обратно
    setDirectionModal(true);
    setAgeModal(false);
    setFormatModal(false);
    dispatch(triggerSearch());
    setIsModalOpen(false);
    dispatch(setFilterMobile());
  };
  const filterState = useSelector((state) => state.filter);

  const openFilterModal = () => {
    setIsModalOpen(true);
    setSelectedDirection(filterState.direction);
    setFormatFilter(filterState.format);
    setSelectedCity(filterState.city);
    setSelectedDistrict(filterState.district);
    setAgeFilter(filterState.age);
    dispatch(setFilterMobile());
  };

  const isFilterActive =
    filterState.format ||
    filterState.city ||
    filterState.district ||
    filterState.direction;


  return (
    <div style={{ width: "100vw", padding: "16px 24px" }}>
      <div
        style={{
          // backgroundColor: "black",
          height: "60px",
          width: "100%",
          display: "flex",
        }}
      >
        <div
          className="button_tertiary Body-3"
          style={{
            height: "44px",
            display: "flex",
            alignItems: "start",
            justifyContent: "center",

            // position: "relative",
            borderRadius: "90px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "8px 20px",
            flexDirection: "column",
            width: "100%",
            gap: "4px",
          }}
          onClick={openFilterModal}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              border: "none",
              backgroundColor: "transparent",
              padding: "0px",
              outline: "none",
              cursor: "pointer",
              justifyContent: "start",
            }}
          >
            <Search />
            <div
              className="Body-3"
              style={{
                color: "black",
                whiteSpace: "nowrap",
                fontSize: "18px",
              }}
            >
              {filterState.direction
                ? filterState.direction
                : " Чему обучиться?"}
            </div>
          </button>
          <div
            style={{
              display: "flex",
              gap: "8px",
              color: "#666666",
              padding: "0px",
              fontSize: "14px",
              justifyContent: "center",
              overflow: "hidden", // Hide overflow
            }}
          >
            <span
              className="Body-2"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "140px",
              }}
            >
              • {!filterState.format && "Формат"}
              {filterState.format === "Онлайн"
                ? filterState.format
                : filterState.city +
                  (filterState.district ? `, ${filterState.district}` : "")}
            </span>
            <span
              className="Body-2"
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                // width: "20px",
              }}
            >
              • {filterState.age ? `${filterState.age} лет` : "Возраст"}
            </span>
          </div>
        </div>

        {isFilterActive && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              height: "64px",
              width: "54px",
              alignItems: "center",
              marginLeft: "8px",
            }}
            onClick={() => {
              dispatch(setFilterGroupMobile());
              dispatch(hideFooterMenu());
            }}
          >
            <div
              className="button_only_icon"
              style={{
                padding: "0px",
                display: "flex",
                alignItems: "center",
                width: "40px", // Ширина div
                height: "40px", // Высота div
                borderRadius: "50%", // Делаем div круглым
                justifyContent: "center", // Центрируем содержимое по горизонтали
              }}
            >
              <Filter />
            </div>
          </div>
        )}
      </div>
      {isModalOpen && (
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
                <div className="h5" onClick={handleResetFilters}>
                  ✕
                </div>
              </button>
              <div className="h5">Фильтры</div>
            </div>
            {directionModal ? (
              <div
                style={{
                  padding: "8px 0px",
                }}
              >
                <div
                  style={{
                    border: "1px solid #EBEBEB",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    borderRadius: "32px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div className="h5">Доступные направления</div>
                  <div
                    // className="directions-container"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "16px",
                      maxWidth: "75vw",
                      overflowX: "auto",
                      maxHeight: "300px",
                      scrollPaddingRight: "300px",
                    }}
                  >
                    {directionsList.map((dir, index) => (
                      <div
                        key={index}
                        className="direction"
                        onClick={() => handleDirectionSelect(dir.name)}
                        style={{
                          backgroundColor:
                            selectedDirection === dir.name
                              ? "#E9E9E9"
                              : "transparent", // Покраска выбранного пункта
                          marginBottom: "16px",
                          // flex: "0 0 auto",
                        }}
                      >
                        <img src={dir.imgSrc} alt={dir.name} />
                        <div className="Body-3">{dir.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "8px 0px",
                }}
                onClick={() => {
                  setDirectionModal(true);
                  setFormatModal(false);
                  setAgeModal(false);
                }}
              >
                <div
                  style={{
                    border: "1px solid #EBEBEB",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "20px 20px",
                    borderRadius: "32px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    flexDirection: "row",
                  }}
                >
                  <div
                    className="Body-3"
                    style={{
                      marginLeft: "16px",
                      color: "#757575",
                    }}
                  >
                    Направление
                  </div>
                  <div
                    className="Body-3"
                    style={{
                      whiteSpace: "nowrap", // Не переносить текст на новую строку
                      overflow: "hidden", // Скрывает текст, выходящий за границы
                      textOverflow: "ellipsis", // Добавляет многоточие для длинного текста
                    }}
                  >
                    {selectedDirection === "3D Моделирование"
                      ? "3D"
                      : selectedDirection === "2D Рисование"
                      ? "2D"
                      : selectedDirection || "Добавить"}
                  </div>
                </div>
              </div>
            )}
            {!formatModal ? (
              <div
                style={{
                  padding: "8px 0px",
                }}
                onClick={() => handleClickFormat()}
              >
                <div
                  style={{
                    border: "1px solid #EBEBEB",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "20px 20px",
                    borderRadius: "32px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    flexDirection: "row",
                  }}
                >
                  <div
                    className="Body-3"
                    style={{ marginLeft: "16px", color: "#757575" }}
                  >
                    Формат
                  </div>
                  <div
                    className="Body-3"
                    style={{
                      maxWidth: "140px",
                      overflow: "hidden", // Обрезает содержимое, если оно не помещается
                      textOverflow: "ellipsis", // Добавляет многоточие в конце обрезанного текста
                      whiteSpace: "nowrap", // Предотвращает перенос текста на новую строку
                    }}
                  >
                    {formatFilter === "Онлайн"
                      ? "Онлайн"
                      : formatFilter === "Оффлайн" && selectedCity
                      ? `${selectedCity}${
                          selectedDistrict ? `, ${selectedDistrict}` : ""
                        }`
                      : "Выбрать формат"}{" "}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "8px 0px",
                }}
              >
                <div
                  style={{
                    border: "1px solid #EBEBEB",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    borderRadius: "32px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    // height: "300px",
                  }}
                >
                  <div className="h5 dropdown-header">
                    Выберите формат обучения
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "start",
                      width: "100%",
                    }}
                  >
                    <div>
                      <button
                        className="button_tertiary Body-3 button-animate-filter"
                        onClick={() => handleFormatSelect("Онлайн")}
                        style={{
                          border:
                            formatFilter === "Онлайн" && `1px solid black`,
                          color:
                            formatFilter === "Онлайн" ? "black" : "#757575",
                          height: "44px",
                        }}
                      >
                        Онлайн
                      </button>
                    </div>

                    <div style={{ position: "relative", marginTop: "12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          // width: "100%",
                          maxWidth: "300px",
                        }}
                      >
                        <input
                          type="text"
                          value={
                            selectedCity +
                            (selectedDistrict ? `, ${selectedDistrict}` : "")
                          }
                          onChange={handleInputChange}
                          placeholder="Оффлайн - Выбрать локацию"
                          className="input_with_icon Body-3"
                          ref={cityInputRef}
                          style={{
                            border: isCitySelected ? "1px solid black" : "",
                            width: "100%",
                            overflow: "hidden", // Обрезает содержимое, если оно не помещается
                            textOverflow: "ellipsis", // Добавляет многоточие в конце обрезанного текста
                            whiteSpace: "nowrap", // Предотвращает перенос текста на новую строку
                          }}
                        />

                        {selectedCity && (
                          <span
                            className="clear-icon"
                            style={{ width: "40px", marginRight: "-20px" }}
                            onClick={() => {
                              setSelectedCity("");
                              setSelectedDistrict("");
                              setFilteredOptions([]);
                              setFormatFilter("");
                              // dispatch(setCity(""));
                              // setCity("");
                              setIsCitySelected(false);
                            }}
                          >
                            ✕
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      {filteredOptions.length > 0 && (
                        <ul
                          className="city-list Body-2"
                          style={{
                            marginTop: "16px",
                            width: "100%",
                            height: "150px",
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
                              style={{
                                border: isCitySelected ? "1px solid black" : "",

                                width: "70vw",
                                marginTop: "8px",
                                display: "flex", // Добавляем flexbox
                                alignItems: "center", // Выровнять по центру по вертикали
                              }}
                            >
                              <div
                                style={{
                                  height: "35px",
                                  minWidth: "35px",
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

                                  overflow: "hidden", // Обрезает содержимое, если оно не помещается
                                  textOverflow: "ellipsis", // Добавляет многоточие в конце обрезанного текста
                                  whiteSpace: "nowrap", // Предотвращает перенос текста на новую строку
                                }}
                              >
                                {option}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {ageModal ? (
              <div
                style={{
                  padding: "8px 0px",
                }}
              >
                <div
                  style={{
                    border: "1px solid #EBEBEB",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    borderRadius: "32px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    // height: "300px",
                  }}
                >
                  <div className="h5 dropdown-header">Укажите возраст</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      width: "100%",
                    }}
                  >
                    <div
                      className="input_with_icon Body-3"
                      style={{
                        // height: "56px",
                        display: "flex",
                        flexDirection: ageFilter && "column",
                        alignItems: ageFilter ? "start" : "center",
                        position: "relative",
                        width: "120px",
                      }}
                      onClick={handleAgeClick}
                    >
                      <div>
                        <input
                          type="number"
                          value={ageFilter}
                          onChange={handleAgeChange}
                          placeholder="Возраст"
                          className="input-age Body-3"
                          style={{
                            paddingRight: ageFilter ? "12px" : "0px",
                            boxSizing: "border-box",
                          }}
                          ref={ageInputRef}
                        />
                      </div>
                      {ageFilter && (
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
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: "8px 0px",
                }}
                onClick={handleAgeFormat}
              >
                <div
                  style={{
                    border: "1px solid #EBEBEB",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    padding: "20px 20px",
                    borderRadius: "32px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    flexDirection: "row",
                  }}
                >
                  <div
                    className="Body-3"
                    style={{ marginLeft: "16px", color: "#757575" }}
                  >
                    Возраст
                  </div>
                  <div className="Body-3" style={{}}>
                    {ageFilter ? `${ageFilter} лет` : "Указать возраст"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
