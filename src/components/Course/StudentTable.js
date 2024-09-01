import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Calendar } from "../../images/calendar.svg";
import { ReactComponent as More } from "../../images/more.svg";
import moment from "moment";
import { useParams } from "react-router-dom";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { useSelector } from "react-redux";
import { useMediaQuery, useTheme } from "@mui/material";
import { useFetchInvoicesByCourseIdQuery } from "../../redux/services/invoiceAPI";
import {
  selectCurrentInvoice,
  selectInvoiceStatus,
  setLoading,
} from "../../redux/reducers/invoiceReducer";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { Skeleton } from "@mui/material"; // Добавьте импорт

// Переименуем компонент в StudentTable
export default function StudentTable() {
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
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest(".button_only_icon")
      ) {
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

  const startDate = moment(course.start_day).startOf("month");
  const endDate = moment(course.end_day).endOf("month");

  // Начать с первого числа следующего месяца
  let currentMonth = startDate.startOf("month");

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

  useEffect(() => {
    // Функция для подсчета активных дней текущего месяца
    const calculateActiveDatesForCurrentMonth = () => {
      const currentMonthString = moment().format("MMMM YYYY");
      const startOfMonth = moment(currentMonthString, "MMMM YYYY").startOf(
        "month"
      );
      const endOfMonth = moment(currentMonthString, "MMMM YYYY").endOf("month");
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

      setActiveDates(dates);
    };

    calculateActiveDatesForCurrentMonth();
  }, [course]);

  const handleModalToggle = () => {
    if (!isModalOpen && !selectedMonth) {
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
  const formattedMonth = selectedMonth
    ? moment(selectedMonth, "MMMM YYYY")
    : moment();

  const {
    data: invoices,
    error,
    isLoading,
  } = useFetchInvoicesByCourseIdQuery({
    courseId: id,
    startDate: formattedMonth.startOf("month").format("YYYY-MM-DD"), // выбранный месяц или текущий
    endDate: formattedMonth.endOf("month").format("YYYY-MM-DD"), // выбранный месяц или текущий
  });

  const [students, setStudents] = useState([]);
  useEffect(() => {
    if (invoices?.data) {
      setStudents(
        invoices.data.map((invoice) => ({
          name: `${invoice.attributes.name} ${invoice.attributes.family}`,
          phone: invoice.attributes.phone,
          sum: invoice.attributes.sum,
        }))
      );
    }
    setLoading();
  }, [invoices, error]);
  const ManagerId = process.env.REACT_APP_MANAGER;
  const TeacherId = process.env.REACT_APP_TEACHER;
  const user = useSelector(selectCurrentUser);

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #CDCDCD",
          marginTop: "32px",
        }}
      ></div>
      {!isLoading ? (
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
                minHeight: "240px",
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
                <li
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #CDCDCD",
                    position: "sticky",
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 2,
                    minWidth: "100%",

                    height: "40px",
                  }}
                >
                  {user?.role?.id === Number(ManagerId) && (
                    <div
                      className="Body-3"
                      style={{
                        flex: "1",
                        padding: "8px",
                        alignItems: "center",
                      }}
                    >
                      №
                    </div>
                  )}
                  <div
                    className="Body-3"
                    style={{
                      flex: "2",
                      padding: "8px",
                      position: "sticky",
                      left: 0,
                      backgroundColor: "white",
                      zIndex: 1,
                      minWidth: "130px",
                    }}
                  >
                    Имя
                  </div>
                  {user?.role?.id === Number(ManagerId) && (
                    <div
                      className="Body-3"
                      style={{ flex: "2", padding: "8px" }}
                    >
                      Телефон
                    </div>
                  )}
                  {user?.role?.id === Number(ManagerId) && (
                    <div
                      className="Body-3"
                      style={{ flex: "2", padding: "8px" }}
                    >
                      Оплата
                    </div>
                  )}
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
                    style={{
                      flex: "1",
                      paddingRight: "8px",
                      paddingLeft: "8px",
                    }}
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
                          width: "180px",
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
                    <div
                      className="Body-2"
                      style={{ flex: "1", padding: "8px" }}
                    >
                      {index + 1}
                    </div>
                    <div
                      className="Body-2"
                      style={{
                        flex: "2",
                        padding: "8px",
                        position: "sticky",
                        left: 0,
                        backgroundColor: "white",
                        zIndex: 1,
                        minWidth: "130px",
                      }}
                    >
                      {student.name}
                    </div>
                    {user?.role?.id === Number(ManagerId) && (
                      <div
                        className="Body-2"
                        style={{ flex: "2", padding: "8px" }}
                      >
                        {student.phone}
                      </div>
                    )}
                    {user?.role?.id === Number(ManagerId) && (
                      <div
                        className="Body-2"
                        style={{ flex: "2", padding: "8px" }}
                      >
                        {student.sum}
                      </div>
                    )}
                    {activeDates.map((date, index) => (
                      <div
                        key={index}
                        className="Body-2"
                        style={{ flex: "1", padding: "8px" }}
                      >
                        -
                      </div>
                    ))}
                    <div style={{ flex: "1", padding: "8px" }}>
                      {user?.role?.id === Number(ManagerId) && (
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
                      )}
                    </div>
                  </li>
                ))}
                {/* Добавьте дополнительные строки по необходимости */}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          height={300}
          width={"100%"}
        />
      )}
    </div>
  );
}
