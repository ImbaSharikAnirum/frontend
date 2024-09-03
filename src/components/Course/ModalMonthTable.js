import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReactComponent as Calendar } from "../../images/calendar.svg";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { ReactComponent as Check } from "../../images/check.svg";
import {
  clearStudents,
  selectSelectedMonth,
  setActiveDates,
  setSelectedMonth,
} from "../../redux/reducers/courseTableReducer";
import { setLoading } from "../../redux/reducers/invoiceReducer";

export default function ModalMonthTable() {
  const dispatch = useDispatch();
  //Данные о курсы
  const course = useSelector(selectCurrentCourse);
  //текущий месяц
  const todayMonth = moment().format("MMMM YYYY");

  // Подсчет месяцев с учетом стартового и конечного дня курса
  const startDate = moment(course.start_day).startOf("month");
  const endDate = moment(course.end_day).endOf("month");
  let currentMonth = startDate.startOf("month");
  const monthsArray = [];
  while (currentMonth.isBefore(endDate)) {
    monthsArray.push(currentMonth.format("MMMM YYYY"));
    currentMonth = currentMonth.add(1, "month");
  }
  const months = monthsArray;

  //Открытие модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  //Выбранный мексяц
  const selectedMonth = useSelector(selectSelectedMonth);

  const handleModalToggle = () => {
    if (!isModalOpen && !selectedMonth) {
      // Устанавливаем первый месяц в selectedMonth, если модальное окно открывается впервые
      dispatch(setSelectedMonth(months[0]));
    }
    setIsModalOpen(!isModalOpen);
  };

  // Сохранение индекса выбранного месяца
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState(null);

  // После нажатия выбора месяца
  const handleMonthSelect = (month) => {
    dispatch(setLoading());

    dispatch(clearStudents());
    // Указывает выбранный месяц
    // setSelectedMonthState(month);
    // Закрывает модалку
    setIsModalOpen(false);

    //Сохраняет активные дни месяца
    const dates = getActiveDatesForMonth(month);
    dispatch(setActiveDates(dates));
    dispatch(setSelectedMonth(month));
  };

  // Подсчет активных дней в месяце

  const getActiveDatesForMonth = useCallback(
    (month) => {
      const activeDays = {
        monday: course.monday,
        tuesday: course.tuesday,
        wednesday: course.wednesday,
        thursday: course.thursday,
        friday: course.friday,
        saturday: course.saturday,
        sunday: course.sunday,
      };
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
          dates.push(date.format("D MMM"));
        }
      }

      return dates;
    },
    [course]
  );

  //Подсчет активных дней при загрузке страницы и месяца
  useEffect(() => {
    const dates = getActiveDatesForMonth(todayMonth);
    dispatch(setActiveDates(dates));
    dispatch(setSelectedMonth(todayMonth));
  }, [dispatch, todayMonth, getActiveDatesForMonth]);

  // Закрывает модалку при нажатии вне поля
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        !event.target.closest(".button_only_icon")
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
          zIndex: 1000,
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
            width: "200px",
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
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderRadius: "8px",
                  cursor: "pointer",
                  marginRight: "8px",
                  height: "20px",
                  backgroundColor:
                    index === hoveredMonthIndex ? "#E9E9E9" : "transparent",
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
                {month === selectedMonth && (
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
    </div>
  );
}
