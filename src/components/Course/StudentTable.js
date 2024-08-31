import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Calendar } from "../../images/calendar.svg";
import { ReactComponent as More } from "../../images/more.svg";
import moment from "moment";
import { useParams } from "react-router-dom";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { useSelector } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";

// Переименуем компонент в StudentTable
export default function StudentTable() {
  const students = [
    {
      name: "Тест",
      phone: "Тест",
    },
    {
      name: "Тест1",
      phone: "Тест1",
    },
    {
      name: "Тест2",
      phone: "Тест2",
    },
    {
      name: "Тест3",
      phone: "Тест3",
    },
    {
      name: "Тест4",
      phone: "Тест4",
    },
    {
      name: "Тест5",
      phone: "Тест5",
    },
    {
      name: "Тест6",
      phone: "Тест6",
    },
    {
      name: "Тест7",
      phone: "Тест7",
    },
    {
      name: "Тест8",
      phone: "Тест8",
    },
    {
      name: "Тест9",
      phone: "Тест9",
    },
    {
      name: "Тест10",
      phone: "Тест10",
    },
  ];

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [scrollTop, setScrollTop] = useState(0);
  const course = useSelector(selectCurrentCourse);
  const { id } = useParams();

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState(null);
  const modalRef = useRef(null);

  const startDay = moment(course.start_day);
  const endDay = moment(course.end_day);

  const startDate = moment(course.start_day).startOf("month");
  const endDate = moment(course.end_day).endOf("month");

  // Начать с первого числа следующего месяца
  let currentMonth = startDate.add(1, "month").startOf("month");

  const monthsArray = [];

  while (currentMonth.isBefore(endDate)) {
    monthsArray.push(currentMonth.format("MMMM YYYY"));
    currentMonth = currentMonth.add(1, "month");
  }

  const months = monthsArray;
  const [activeDates, setActiveDates] = useState([]);

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setIsModalOpen(false);

    const sessions = calculateSessionsInMonth(month);
    setSessionCount(sessions);

    // Вычисляем активные даты для выбранного месяца
    const dates = getActiveDatesForMonth(month);
    setActiveDates(dates);
  };
  const getActiveDatesForMonth = (month) => {
    const startOfMonth = moment(month, "MMMM YYYY").startOf("month");
    const endOfMonth = moment(month, "MMMM YYYY").endOf("month");
    const dates = [];

    for (
      let date = startOfMonth.clone();
      date.isSameOrBefore(endOfMonth);
      date.add(1, "day")
    ) {
      const dayOfWeek = date.locale("en").format("dddd").toLowerCase();
      if (activeDays[dayOfWeek]) {
        dates.push(date.format("D MMM")); // Добавляем число и месяц
      }
    }

    return dates;
  };
  const [sessionCount, setSessionCount] = useState(0);

  const handleModalToggle = () => {
    if (!isModalOpen) {
      // Устанавливаем первый месяц в selectedMonth, если модальное окно открывается впервые
      const firstMonth = months[0];
      setSelectedMonth(firstMonth);
      const sessions = calculateSessionsInMonth(firstMonth);
      setSessionCount(sessions);
    }
    setIsModalOpen(!isModalOpen);
  };
  const activeDays = {
    monday: course.monday,
    tuesday: course.tuesday,
    wednesday: course.wednesday,
    thursday: course.thursday,
    friday: course.friday,
    saturday: course.saturday,
    sunday: course.sunday,
  };
  const startOfMonth = moment(months[0], "MMMM YYYY").startOf("month");
  const endOfMonth = moment(months[0], "MMMM YYYY").endOf("month");
  // Считаем количество активных дней в выбранном месяце
  let sessionCountFirst = 0;
  for (
    let date = startOfMonth.clone();
    date.isSameOrBefore(endOfMonth);
    date.add(1, "day")
  ) {
    const dayOfWeek = date.locale("en").format("dddd").toLowerCase();

    if (activeDays[dayOfWeek]) {
      sessionCountFirst++;
    }
  }
  const calculateSessionsInMonth = (month) => {
    const startOfMonth = moment(month, "MMMM YYYY").startOf("month");
    const endOfMonth = moment(month, "MMMM YYYY").endOf("month");
    // Считаем количество активных дней в выбранном месяце
    let sessionCount = 0;
    for (
      let date = startOfMonth.clone();
      date.isSameOrBefore(endOfMonth);
      date.add(1, "day")
    ) {
      const dayOfWeek = date.locale("en").format("dddd").toLowerCase();
      if (activeDays[dayOfWeek]) {
        sessionCount++;
      }
    }

    return sessionCount;
  };
  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #CDCDCD",
          marginTop: "32px",
        }}
      ></div>
      <div
        className="box"
        style={{
          marginTop: "32px",
          padding: "0px",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <div
          style={{
            padding: "20px",
          }}
        >
          <div
            className="scroll"
            style={{
              overflowY: "auto",
              overflowX: "auto",
              maxHeight: "350px",
            }}
          >
            <ul
              style={{
                padding: "0",
                marginRight: "20px",
                listStyle: "none",
                minWidth: "600px",
              }}
            >
              {/* Header row */}
              <li
                style={{
                  display: "flex",
                  borderBottom: "1px solid #CDCDCD",
                  position: "sticky",
                  top: 0, // Stick the header to the top
                  backgroundColor: "white", // Ensure background covers other elements
                  zIndex: 2, // Ensure it stays above other rows
                  minWidth: "100%",
                  height: "40px",
                }}
              >
                <div
                  className="Body-3"
                  style={{ flex: "1", padding: "8px", alignItems: "center" }}
                >
                  №
                </div>
                <div
                  className="Body-3"
                  style={{
                    flex: "2",
                    padding: "8px",
                    position: "sticky",
                    left: 0,
                    backgroundColor: "white", // Ensure background covers other elements
                    zIndex: 1, // Ensure it stays above other columns
                  }}
                >
                  Имя
                </div>
                <div className="Body-3" style={{ flex: "2", padding: "8px" }}>
                  Телефон
                </div>
                <div className="Body-3" style={{ flex: "2", padding: "8px" }}>
                  Оплата
                </div>
                {activeDates.map((date, index) => (
                  <div
                    key={index}
                    className="Body-3"
                    style={{ flex: "1", padding: "8px" }}
                  >
                    {date}
                  </div>
                ))}
                <div
                  style={{ flex: "1", paddingRight: "8px", paddingLeft: "8px" }}
                >
                  <button
                    className="button_only_icon  button_white button-animate-filter"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "36px",
                      width: "36px",
                      border: "none",
                      cursor: "pointer",
                      zIndex: 1000, // Убедитесь, что кнопка находится поверх других элементов
                    }}
                    onClick={handleModalToggle}
                  >
                    <Calendar style={{ fill: "white" }} />
                  </button>
                  {isModalOpen && (
                    <div
                      className="modal"
                      ref={modalRef}
                      style={{
                        position: "absolute",
                        top: "50px",
                        // left: "0",
                        right: "0",
                        zIndex: 1000,
                        backgroundColor: "#fff",
                        boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
                        borderRadius: "12px",
                        width: "150px",
                        padding: "12px",
                        overflowY: "auto",
                      }}
                    >
                      <ul
                        className="teacher-list Body-2"
                        style={{
                          listStyleType: "none",
                          padding: 0,
                          margin: 0,
                          maxHeight: "150px",
                        }}
                      >
                        {months.map((month, index) => (
                          <li
                            key={index}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleMonthSelect(month);
                            }}
                            onMouseEnter={() => setHoveredMonthIndex(index)}
                            onMouseLeave={() => setHoveredMonthIndex(null)}
                            className={`city-list-item  ${
                              index === hoveredMonthIndex ? "hovered" : ""
                            }`}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "8px 0",
                              borderRadius: "8px",
                              cursor: "pointer",
                              marginRight: "8px",
                              height: "20px",
                              backgroundColor:
                                index === hoveredMonthIndex
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
                              {month}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </li>

              {/* Data rows */}
              {students.map((student, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #CDCDCD",
                    height: "50px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: "1", padding: "8px" }}>
                    <input type="checkbox" />
                  </div>
                  <div
                    style={{
                      flex: "2",
                      padding: "8px",
                      position: "sticky",
                      left: 0,
                      backgroundColor: "white", // Ensure background covers other elements
                      zIndex: 1, // Ensure it stays above other columns
                    }}
                  >
                    {student.name}
                  </div>
                  <div style={{ flex: "2", padding: "8px" }}>
                    {student.phone}
                  </div>
                  <div style={{ flex: "2", padding: "8px" }}>4500</div>
                  <div style={{ flex: "1", padding: "8px" }}>Present</div>
                  <div style={{ flex: "1", padding: "8px" }}>Absent</div>
                  <div style={{ flex: "1", padding: "8px" }}>Present</div>
                  <div style={{ flex: "1", padding: "8px" }}>Present</div>
                  <div style={{ flex: "1", padding: "8px" }}>
                    <button
                      className="button_only_icon  button_white button-animate-filter"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "36px",
                        width: "36px",
                        border: "none",
                        cursor: "pointer",
                        zIndex: 1000, // Убедитесь, что кнопка находится поверх других элементов
                      }}
                    >
                      <More style={{ fill: "white" }} />
                    </button>
                  </div>
                </li>
              ))}
              {/* Добавьте дополнительные строки по необходимости */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
