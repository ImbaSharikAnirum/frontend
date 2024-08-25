import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../styles/courses.css";
import "../../styles/modal.css";
import { ReactComponent as Filter } from "../../images/Filter.svg";
import { Skeleton, Slider } from "@mui/material";
import { ReactComponent as Search } from "../../images/search.svg";
import "../../styles/FilterModalStyles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setDaysOfWeekForCount,
  setPriceRangeCount,
  setTeacherCount,
  setTimeCount,
} from "../../redux/filterForCountSlice"; // Импортируйте действие из filterForCountSlice
import { setFilterGroupMobile } from "../../redux/footerMenuSlice";
import moment from "moment-timezone";
import { useMediaQuery } from "react-responsive";

import {
  setPriceRange,
  setDaysOfWeek,
  setTimeOfDay,
  setTeacher,
  setTime,
  // resetFilterState,
} from "../../redux/filterSlice";
import { fetchCoursesCountFromAPI } from "../../redux/coursesCountSlice";

export default function FilterGroup({ loading }) {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const filterGroupMobile = useSelector(
    (state) => state.footerMenu.isFilterGroupMobile
  );
  // const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [selectedDays, setSelectedDays] = useState(["Неважно"]);
  const [selectedTime, setSelectedTime] = useState("Неважно");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [hoveredTeacherIndex, setHoveredTeacherIndex] = useState(null);

  const teachers = [
    { id: 1, name: "Виктория", family: "Поезд" },
    { id: 2, name: "Ксения", family: "Григорьева" },
    { id: 3, name: "Яна", family: "Базарова" },
    { id: 4, name: "Полина", family: "Торганова" },
    { id: 5, name: "Сергей", family: "Сергеев" },
    { id: 6, name: "Алексей", family: "Алексеев" },
    { id: 7, name: "Анастасия", family: "Чеснокова" },
  ];

  const handleTeacherInputChange = (event) => {
    const value = event.target.value;
    setSelectedTeacher(value);

    if (value) {
      const filtered = teachers.filter((teacher) => {
        const fullName = `${teacher.family.toLowerCase()} ${teacher.name.toLowerCase()}`;
        return (
          teacher.id.toString().startsWith(value) ||
          teacher.name.toLowerCase().startsWith(value.toLowerCase()) ||
          teacher.family.toLowerCase().startsWith(value.toLowerCase()) ||
          fullName.startsWith(value.toLowerCase())
        );
      });
      setFilteredTeachers(filtered.slice(0, 5));
    } else {
      setFilteredTeachers([]);
    }
  };

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(`${teacher.family} ${teacher.name} #${teacher.id}`);
    setSelectedTeacherId(`${teacher.id}`);
    setFilteredTeachers([]);
    dispatch(setTeacherCount(teacher.id));
    dispatch(fetchCoursesCountFromAPI());
  };

  const handleTeacherHover = (index) => {
    setHoveredTeacherIndex(index);
  };

  const handleTeacherMouseLeave = () => {
    setHoveredTeacherIndex(null);
  };
  const [lastFilterState, setLastFilterState] = useState({
    minPrice: 500,
    maxPrice: 5000,
    selectedDays: ["Неважно"],
    selectedTime: "Неважно",
    selectedTeacher: "",
  });

  const modalRef = useRef(null);
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      // Сбрасываем фильтры на последние сохранённые значения
      setMinPrice(lastFilterState.minPrice);
      setMaxPrice(lastFilterState.maxPrice);
      setSelectedDays(lastFilterState.selectedDays);
      setSelectedTime(lastFilterState.selectedTime);
      setSelectedTeacher(lastFilterState.selectedTeacher);
      setFilteredTeachers([]); // Очищаем список учителей

      // Закрываем модальное окно
      dispatch(setFilterGroupMobile());
    }
  };
  useEffect(() => {
    if (filterGroupMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    }

    // Убедитесь, что обработчик удаляется при размонтировании компонента
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  });

  const handleSliderChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
    dispatch(setPriceRangeCount({ min: newValue[0], max: newValue[1] }));
    dispatch(fetchCoursesCountFromAPI());
  };

  const handleDayClick = (day) => {
    setSelectedDays((prevSelectedDays) => {
      let newSelectedDays;
      if (day === "Неважно") {
        newSelectedDays = ["Неважно"];
      } else {
        const isCurrentlySelected = prevSelectedDays.includes(day);
        newSelectedDays = isCurrentlySelected
          ? prevSelectedDays.filter((d) => d !== day)
          : [...prevSelectedDays.filter((d) => d !== "Неважно"), day];

        if (newSelectedDays.length === 0) {
          newSelectedDays = ["Неважно"];
        }
      }

      dispatch(setDaysOfWeekForCount(newSelectedDays));
      dispatch(fetchCoursesCountFromAPI());
      return newSelectedDays;
    });
  };

  // Конвертируем в московское время

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    const timezone = moment.tz.guess(); // Определяем часовой пояс клиента
    let clientStartOfDay, clientEndOfFirstHalf;
    let clientStartOfDayMoscow, clientEndOfFirstHalfMoscow;

    if (time === "1 половина дня") {
      clientStartOfDay = moment.tz("00:00", "HH:mm", timezone); // 00:00 в часовом поясе клиента
      clientEndOfFirstHalf = moment.tz("13:59", "HH:mm", timezone); // 13:59 в часовом поясе клиента
    } else if (time === "2 половина дня") {
      clientStartOfDay = moment.tz("14:00", "HH:mm", timezone);
      clientEndOfFirstHalf = moment.tz("17:59", "HH:mm", timezone);
    } else if (time === "Вечер") {
      clientStartOfDay = moment.tz("18:00", "HH:mm", timezone);
      clientEndOfFirstHalf = moment.tz("23:59", "HH:mm", timezone);
    }

    if (clientStartOfDay && clientEndOfFirstHalf) {
      clientStartOfDayMoscow = clientStartOfDay
        .tz("Europe/Moscow")
        .format("HH:mm:ss");
      clientEndOfFirstHalfMoscow = clientEndOfFirstHalf
        .tz("Europe/Moscow")
        .format("HH:mm:ss");
    }
    setTimeStart(clientStartOfDayMoscow);
    setTimeEnd(clientEndOfFirstHalfMoscow);
    dispatch(
      setTimeCount({
        start: clientStartOfDayMoscow,
        end: clientEndOfFirstHalfMoscow,
      })
    );

    dispatch(fetchCoursesCountFromAPI());
  };

  const handleClearFilters = () => {
    setMinPrice(500);
    setMaxPrice(5000);

    setSelectedDays(["Неважно"]);
    setSelectedTime("Неважно");
    setSelectedTeacher("");
    setTimeStart("");
    setTimeEnd("");
    setSelectedTeacherId("");
    setFilteredTeachers([]);
    dispatch(setDaysOfWeekForCount(["Неважно"]));
    dispatch(setTeacherCount(""));
    dispatch(setPriceRangeCount({ min: 500, max: 5000 }));
    dispatch(setTimeCount({ start: "", end: "" }));
    dispatch(fetchCoursesCountFromAPI());
  };

  const openFilterModal = useCallback(() => {
    // Обновляем состояние фильтров перед открытием модалки
    dispatch(setPriceRangeCount({ min: minPrice, max: maxPrice }));
    dispatch(setTimeCount({ start: timeStart, end: timeEnd }));
    dispatch(setDaysOfWeekForCount(selectedDays));
    dispatch(fetchCoursesCountFromAPI());
    // dispatch(setFilterGroupMobile());
  }, [dispatch, minPrice, maxPrice, timeStart, timeEnd, selectedDays]);

  useEffect(() => {
    if (filterGroupMobile) {
      openFilterModal();
    }
  }, [filterGroupMobile, openFilterModal]);

  const coursesCount = useSelector((state) => state.coursesCount.count);
  const handleApplyFilters = () => {
    // Обновление состояния фильтров
    dispatch(setPriceRange({ min: minPrice, max: maxPrice }));
    dispatch(setTime({ start: timeStart, end: timeEnd }));
    dispatch(setDaysOfWeek(selectedDays));
    dispatch(setTimeOfDay(selectedTime));
    dispatch(setTeacher(selectedTeacherId));
    setLastFilterState({
      minPrice,
      maxPrice,
      selectedDays,
      selectedTime,
      selectedTeacher,
      selectedTeacherId,
      timeStart,
      timeEnd,
    });
    // closeFilterModal();
    dispatch(setFilterGroupMobile());
  };
  const handleMaxPriceChange = (event) => {
    const value = Number(event.target.value);
    setMaxPrice(value);
    dispatch(setPriceRangeCount({ min: minPrice, max: value }));
    dispatch(fetchCoursesCountFromAPI());
    // Обновление количества групп с учетом измененных цен
  };

  const handleMinPriceChange = (event) => {
    const value = Number(event.target.value);
    setMinPrice(value);
    dispatch(setPriceRangeCount({ min: value, max: maxPrice }));
    dispatch(fetchCoursesCountFromAPI());
  };

  return (
    <div
      style={{
        height: "56px",
        display: "flex",
        position: "relative",
      }}
    >
      {/* Кнопка для открытия модалки */}
      {!isMobile &&
        (loading ? (
          <button
            className="button_tertiary Body-3"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "150px",
            }}
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "150px",
            }}
            onClick={() => {
              openFilterModal();
              dispatch(setFilterGroupMobile());
            }}
          >
            <Filter />
            <div>Фильтры</div>
          </button>
        ))}

      {/* Модальное окно */}
      {filterGroupMobile && (
        <div
          className="modal-overlay"
          style={isMobile ? { height: "100vh", width: "100vw" } : {}}
        >
          <div
            className="modal-content"
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            style={
              isMobile
                ? {
                    height: "100%",
                    width: "100%",
                    maxHeight: "100vh",
                    borderRadius: "0px",
                  }
                : {}
            }
          >
            <div className="modal-filter">
              <button
                className="button_white modal-close-button"
                onClick={() => {
                  dispatch(setFilterGroupMobile());
                }}
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
                <div className="h5">✕</div>
              </button>
              <div className="h5">Фильтры</div>
            </div>
            <div className="modal-numbers">
              <div className="modal-body">
                <div className="Body-1">Ценовой диапазон за занятие</div>
                <Slider
                  value={[minPrice, maxPrice]}
                  onChange={handleSliderChange}
                  onChangeCommitted={handleSliderChangeCommitted}
                  valueLabelDisplay="off"
                  min={500}
                  max={8000}
                  step={50}
                  aria-labelledby="range-slider"
                  sx={{
                    width: "100%",
                    "& .MuiSlider-track": {
                      backgroundColor: "black",
                      height: "2px",
                    },
                    "& .MuiSlider-rail": {
                      backgroundColor: "#BDBDBD",
                      height: "4px",
                    },
                    "& .MuiSlider-thumb": {
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #CDCDCD",
                      width: "24px",
                      height: "24px",
                      "&:hover": {
                        boxShadow: "none",
                      },
                      "&:focus, &:focus-visible": {
                        outline: "none",
                        boxShadow: "none",
                      },
                      "&:active": {
                        boxShadow: "none",
                      },
                    },
                    "& .MuiSlider-root": {
                      "&:focus, &:focus-visible": {
                        outline: "none",
                        boxShadow: "none",
                        color: "inherit",
                      },
                    },
                    "& .MuiSlider-valueLabel": {
                      display: "none",
                    },
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <div
                    className="Body-2 input_filter_price_min"
                    style={{ fontSize: "14px" }}
                  >
                    <div style={{ fontSize: 12, color: "#757575" }}>
                      Минимум
                    </div>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={handleMinPriceChange}
                      // readOnly
                      placeholder="От"
                      min={500}
                      max={10000}
                      style={{
                        fontSize: 14,
                        color: "black",
                        border: "none",
                        outline: "none",
                        width: isMobile ? "40px" : "100px",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      width: "40px",
                      height: "1.5px",
                      backgroundColor: "#CDCDCD",
                      margin: "0 10px",
                    }}
                  />
                  <div
                    className="Body-2 input_filter_price_min"
                    style={{ fontSize: "14px" }}
                  >
                    <div style={{ fontSize: 12, color: "#757575" }}>
                      Максимум
                    </div>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={handleMaxPriceChange} // Обработчик изменения значения
                      // readOnly
                      placeholder="До"
                      min={500}
                      max={10000}
                      style={{
                        fontSize: 14,
                        color: "black",
                        border: "none",
                        outline: "none",
                        width: isMobile ? "40px" : "100px",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-body" style={{ marginTop: "36px" }}>
                <div className="Body-1">Дни недели</div>
                <div className="button-group">
                  {[
                    "Неважно",
                    "Понедельник",
                    "Вторник",
                    "Среда",
                    "Четверг",
                    "Пятница",
                    "Суббота",
                    "Воскресенье",
                  ].map((day) => (
                    <button
                      key={day}
                      onClick={() => handleDayClick(day)}
                      className={
                        selectedDays.includes(day)
                          ? "selected button-animate"
                          : "button-animate"
                      }
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-body" style={{ marginTop: "36px" }}>
                <div className="Body-1">Время занятий</div>
                <div className="button-group">
                  {["Неважно", "1 половина дня", "2 половина дня", "Вечер"].map(
                    (time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeClick(time)}
                        className={
                          selectedTime === time
                            ? "selected button-animate"
                            : "button-animate"
                        }
                      >
                        {time}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div
                className="modal-body"
                style={{
                  marginTop: "36px",
                }}
              >
                <div className="Body-1">Поиск преподавателя</div>
                <div className="teacher-search">
                  <Search className="icon" />
                  <input
                    type="text"
                    value={selectedTeacher}
                    onChange={handleTeacherInputChange}
                    placeholder="Введите имя преподавателя"
                    className="input-search Body-2"
                    style={{
                      width: "100%",
                      paddingLeft: "4px",
                      fontSize: "16px",
                    }}
                  />

                  {selectedTeacher && (
                    <span
                      className="clear-icon"
                      onClick={() => {
                        setSelectedTeacher("");
                        setSelectedTeacherId("");
                        setTeacherCount("");
                        setFilteredTeachers([]);
                        dispatch(setTeacherCount(""));
                        dispatch(fetchCoursesCountFromAPI());
                      }}
                    >
                      ✕
                    </span>
                  )}
                </div>
                {filteredTeachers.length > 0 && (
                  <ul className="teacher-list Body-2">
                    {filteredTeachers.map((teacher, index) => (
                      <li
                        key={teacher.id}
                        onClick={() => handleTeacherSelect(teacher)}
                        onMouseEnter={() => handleTeacherHover(index)}
                        onMouseLeave={handleTeacherMouseLeave}
                        className={`teacher-list-item ${
                          index === hoveredTeacherIndex ? "hovered" : ""
                        }`}
                      >
                        <div>{`${teacher.family} ${teacher.name} #${teacher.id}`}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="modal-buttons">
              <button
                className="button_filter_clear Body-2"
                onClick={handleClearFilters}
              >
                Очистить все
              </button>
              <button
                className="button_filter_group Body-2"
                onClick={handleApplyFilters}
              >
                Показать {coursesCount} вариантов
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
