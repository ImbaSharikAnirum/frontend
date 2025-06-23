import React, { useRef, useState, useEffect } from "react";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { selectMonthsWithActiveDays } from "../../redux/reducers/monthReducer";
import { ReactComponent as Down } from "../../images/down.svg";
import moment from "moment";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import "moment/locale/ru";
import {
  selectCurrency,
  selectCurrencyCode,
} from "../../redux/reducers/currencyReducer";
import { useFetchCourseByIdQuery } from "../../redux/services/courseAPI";

export default function Form({ isLoading }) {
  const [scrollTop, setScrollTop] = useState(0);
  const course = useSelector(selectCurrentCourse);
  const { id } = useParams();
  const monthsWithActiveDays = useSelector(selectMonthsWithActiveDays);
  const modalRef = useRef(null);
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [sessionCountFirst, setSessionCountFirst] = useState(0);
  const user = useSelector(selectCurrentUser);
  const ManagerId = process.env.REACT_APP_MANAGER;
  const [firstActiveDay, setFirstActiveDay] = useState("");
  const currency = useSelector(selectCurrency);
  const userCurrency = useSelector(selectCurrencyCode);
  const [prevCurrency, setPrevCurrency] = useState(userCurrency);
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(false);

  // Добавляем запрос данных курса с учетом валюты
  const { data: courseData, isLoading: isCourseLoading } =
    useFetchCourseByIdQuery(id, {
      currency: userCurrency,
    });

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

  useEffect(() => {
    if (monthsWithActiveDays.length > 0) {
      const currentMonth = moment().format("MMMM YYYY");

      const nextMonthIndex = monthsWithActiveDays.findIndex((m) =>
        moment(m.month, "MMMM YYYY").isAfter(moment(currentMonth, "MMMM YYYY"))
      );

      if (nextMonthIndex !== -1) {
        setSelectedMonth(monthsWithActiveDays[nextMonthIndex].month);
      } else {
        setSelectedMonth(
          monthsWithActiveDays[monthsWithActiveDays.length - 1].month
        );
      }
    }
  }, [monthsWithActiveDays]);

  useEffect(() => {
    const selectedMonthData = monthsWithActiveDays.find(
      (m) => m.month === selectedMonth
    );
    setSessionCountFirst(
      selectedMonthData ? selectedMonthData.activeDays.length : 0
    );
    setFirstActiveDay(
      moment(selectedMonthData?.activeDays[0], "D MMMM YYYY")
        .locale("ru")
        .format("D MMMM YYYY")
    );
  }, [selectedMonth, monthsWithActiveDays]);

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setIsModalOpen(false);
  };

  const selectedenglishMonth = selectedMonth
    ? moment(selectedMonth, "MMMM YYYY").locale("en").format("YYYY-MM")
    : null;
  const linkMonth = selectedenglishMonth && selectedenglishMonth;

  // Обновляем эффект для обработки смены валюты
  useEffect(() => {
    if (prevCurrency !== userCurrency) {
      setIsCurrencyLoading(true);
      setSessionCountFirst(0);
      setFirstActiveDay("");
      setPrevCurrency(userCurrency);
    }
  }, [userCurrency, prevCurrency]);

  // Эффект для сброса состояния загрузки после получения новых данных
  useEffect(() => {
    if (!isCourseLoading && courseData) {
      setIsCurrencyLoading(false);
    }
  }, [isCourseLoading, courseData]);

  const showSkeletons = isLoading || isCurrencyLoading || isCourseLoading;
  const currentPrice = courseData?.price_lesson || course.price_lesson;

  return (
    <div
      className="box"
      style={{
        position: "sticky",
        top: scrollTop > 100 ? "10px" : "100px",
        alignSelf: "flex-start",
        transition: "top 0.3s ease",
        marginLeft: "20px",
        marginTop: "16px",
        zIndex: 1,
      }}
    >
      <div style={{ width: "300px", display: "flex", flexDirection: "column" }}>
        {showSkeletons ? (
          <Skeleton height={24} width={"100%"} variant="text" />
        ) : (
          <div style={{ display: "flex", alignItems: "end" }}>
            <div className="h4" style={{ fontSize: "20px" }}>
              {currentPrice} {currency.symbol}
            </div>
            <div className="Body-3" style={{ marginLeft: "8px" }}>
              занятие
            </div>
          </div>
        )}
        {course.id && user?.role?.id === Number(ManagerId) && (
          <>
            {showSkeletons ? (
              <Skeleton height={70} width={"100%"} variant="text" />
            ) : (
              <div
                className="input_default_border"
                style={{ width: "100%", marginTop: "20px" }}
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
                    alignItems: "center",
                    width: "90%",
                    marginLeft: "20px",
                  }}
                  name="date"
                  required
                >
                  {selectedMonth}
                </button>
                <span style={{ marginRight: "20px" }}>
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
                        overflowY: "auto",
                      }}
                    >
                      {monthsWithActiveDays.map((month, index) => (
                        <li
                          key={index}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleMonthSelect(month.month);
                          }}
                          onMouseEnter={() => setHoveredMonthIndex(index)}
                          onMouseLeave={() => setHoveredMonthIndex(null)}
                          className={`city-list-item  ${
                            month.month === selectedMonth ? "hovered" : ""
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
                              month.month === selectedMonth
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
                            {month.month}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        {showSkeletons ? (
          <Skeleton height={70} width={"100%"} variant="text" />
        ) : (
          <Link
            to={`/booking/${id}/${linkMonth}`}
            style={{
              textDecoration: "none",
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
        )}
        {showSkeletons ? (
          <Skeleton
            height={24}
            variant="text"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        ) : (
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
        )}
        {showSkeletons ? (
          <Skeleton
            height={24}
            variant="text"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "24px",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "32px",
            }}
          >
            <div className="Body-2">Старт обучения:</div>
            <div className="Body-2">{firstActiveDay}</div>
          </div>
        )}
        {showSkeletons ? (
          <Skeleton
            height={24}
            variant="text"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "8px",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <div className="Body-2">В выбранном месяце занятий:</div>
            <div className="Body-2">{sessionCountFirst}</div>
          </div>
        )}
        {showSkeletons ? (
          <Skeleton
            height={24}
            variant="text"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "8px",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <div className="Body-2">
              {currentPrice} {currency.symbol} х {sessionCountFirst} занятий
            </div>
            <div className="Body-2">
              {currentPrice * sessionCountFirst} {currency.symbol}
            </div>
          </div>
        )}
        <div
          style={{
            borderTop: "1px solid #CDCDCD",
            marginTop: "12px",
          }}
        ></div>
        {showSkeletons ? (
          <Skeleton
            height={24}
            variant="text"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "8px",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <div className="Body-3">Всего</div>
            <div className="Body-3">
              {currentPrice * sessionCountFirst} {currency.symbol}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
