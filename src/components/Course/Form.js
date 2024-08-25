import { useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Down } from "../../images/down.svg";
import "../../styles/dropdown.css";
import "../../styles/inputs.css";
import { useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import moment from "moment";
import "moment/locale/ru";
import { Link, useParams } from "react-router-dom";

export default function Form() {
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
  // let currentMonth = startDay.clone();

  while (currentMonth.isSameOrBefore(endDay, "month")) {
    months.push(currentMonth.format("MMMM YYYY"));
    currentMonth.add(1, "month");
  }

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setIsModalOpen(false);

    const sessions = calculateSessionsInMonth(month);
    setSessionCount(sessions);
  };

  // Добавьте состояние для хранения количества занятий
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
  const englishMonth = moment(months[0], "MMMM YYYY")
    .locale("en")
    .format("MMMM YYYY");
  const selectedenglishMonth = selectedMonth
    ? moment(selectedMonth, "MMMM YYYY").locale("en").format("MMMM YYYY")
    : null;
  const linkMonth = selectedenglishMonth ? selectedenglishMonth : englishMonth;
  return (
    <div>
      {!isMobile && (
        <div
          className="box"
          style={{
            position: "sticky",
            top: scrollTop > 100 ? "10px" : "100px",
            alignSelf: "flex-start",
            transition: "top 0.3s ease",
            marginLeft: "20px",
            marginTop: "16px",
          }}
        >
          <div
            style={{
              width: "300px",
              // height: "320px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "end",
              }}
            >
              <div className="h4" style={{ fontSize: "20px" }}>
                {course.price_lesson} р
              </div>
              <div className="Body-3" style={{ marginLeft: "8px" }}>
                занятие
              </div>
            </div>
            <div
              className="input_default_border"
              style={{
                width: "100%",
                marginTop: "20px",
              }}
              onClick={handleModalToggle}
            >
              <button
                className="input_default"
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center", // Выровнять по правому краю
                  width: "90%",
                  marginLeft: "20px",
                }}
                name="date"
                required
              >
                {selectedMonth || months[0]}
              </button>
              <span
                style={{
                  marginRight: "20px",
                  // width: "20px",
                }}
              >
                <Down />
              </span>
              {isModalOpen && (
                <div
                  className="modal"
                  ref={modalRef}
                  style={{
                    position: "absolute",
                    top: "50px",
                    left: "0",
                    right: "0",
                    zIndex: 1000,
                    backgroundColor: "#fff",
                    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
                    borderRadius: "12px",

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
                      maxHeight: "300px",
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
            <Link
              to={`/booking/${id}/${linkMonth}`}
              style={{
                textDecoration: "none",
                // color: "black",
                width: "100%",
                marginTop: "16px",
              }}
            >
              <button
                className="button Body-3 button-animate-filter"
                style={{ width: "100%" }}
              >
                Забронировать
              </button>
            </Link>
            <div
              className="Body-2"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                marginTop: "8px",
              }}
            >
              Пока вы ни за что не платите
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "32px",
              }}
            >
              <div className="Body-2">В выбранном месяце занятий:</div>
              <div className="Body-2">{sessionCount || sessionCountFirst}</div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
              }}
            >
              <div className="Body-2">
                {course.price_lesson} р х {sessionCount || sessionCountFirst}{" "}
                занятий
              </div>
              <div className="Body-2">
                {course.price_lesson * (sessionCount || sessionCountFirst)} р
              </div>
            </div>
            <div
              style={{
                borderTop: "1px solid #CDCDCD",
                marginTop: "12px",
              }}
            ></div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
              }}
            >
              <div className="Body-3">Всего</div>
              <div className="Body-3">
                {course.price_lesson * (sessionCount || sessionCountFirst)} р
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
