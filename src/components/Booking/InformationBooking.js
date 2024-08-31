import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Left } from "../../images/left.svg";
import { Skeleton, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFetchCourseByIdQuery } from "../../redux/services/courseAPI";
import {
  resetCourse,
  selectCurrentCourse,
  setCourse,
  setError,
} from "../../redux/reducers/courseReducer";
import moment from "moment";
import {
  setInvoice,
  updateInvoiceField,
} from "../../redux/reducers/invoiceReducer";

export default function InformationBooking() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id, date } = useParams();
  const dispatch = useDispatch();
  const { data, error, isLoading } = useFetchCourseByIdQuery(id);

  const course = useSelector(selectCurrentCourse);
  const startOfMonth = moment(date).locale("ru").format("MMMM YYYY");
  const endOfMonth = moment(course.end_day, "YYYY-MM-DD")
    .locale("ru")
    .format("MMMM YYYY");
  const activeDays = {
    monday: course.monday,
    tuesday: course.tuesday,
    wednesday: course.wednesday,
    thursday: course.thursday,
    friday: course.friday,
    saturday: course.saturday,
    sunday: course.sunday,
  };

  useEffect(() => {
    if (data) {
      dispatch(setCourse(data));
    } else if (error) {
      dispatch(setError(error));
    }
    return () => {
      dispatch(resetCourse());
    };
  }, [data, error, dispatch]);
  const getFirstActiveDayOfMonth = (startOfMonth, activeDays) => {
    const firstDayOfMonth = moment(startOfMonth, "MMMM YYYY").startOf("month");

    // Перебираем дни недели, чтобы найти первый активный день
    for (let day in activeDays) {
      if (activeDays[day]) {
        // Найти первый активный день недели
        let firstActiveDay = firstDayOfMonth.clone().startOf("week").day(day);

        // Проверить, если первый активный день недели в пределах текущего месяца
        if (firstActiveDay.isBefore(firstDayOfMonth, "month")) {
          firstActiveDay.add(1, "week");
        }

        return firstActiveDay;
      }
    }

    // Если нет активных дней недели
    return null;
  };
  const getLastActiveDayOfMonth = (startOfMonth, activeDays) => {
    const lastDayOfMonth = moment(startOfMonth, "MMMM YYYY").endOf("month");

    // Перебираем дни недели с конца месяца
    for (let day in activeDays) {
      if (activeDays[day]) {
        let lastActiveDay = lastDayOfMonth.clone().startOf("week").day(day);

        // Если найденный день находится после последнего дня месяца, перемещаем его на предыдущую неделю
        if (lastActiveDay.isAfter(lastDayOfMonth)) {
          lastActiveDay.subtract(1, "week");
        }

        return lastActiveDay;
      }
    }

    return null;
  };

  // Применение функции
  const lastActiveDay = getLastActiveDayOfMonth(startOfMonth, activeDays);
  const formattedLastActiveDay = lastActiveDay
    ? lastActiveDay.format("YYYY-MM-DD") // Изменено на нужный формат
    : null;

  const firstActiveDay = getFirstActiveDayOfMonth(startOfMonth, activeDays);
  const formattedStartDay = firstActiveDay
    ? firstActiveDay.format("YYYY-MM-DD") // Изменено на нужный формат
    : null;

  dispatch(
    setInvoice({
      start_day: formattedStartDay,
      end_day: formattedLastActiveDay,
    })
  );
  return (
    <div>
      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={() => window.history.back()}
            className="button_only_icon  button_white button-animate-filter"
            style={{
              display: "flex",
              alignItems: "center",
              height: "36px",
              width: "36px",
              // boxShadow:
              //   "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0", // Пример имитации границы
              // backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              zIndex: 1000, // Убедитесь, что кнопка находится поверх других элементов
            }}
          >
            <Left style={{ fill: "white", width: "80px", height: "80px" }} />
          </button>
          {course.end_day ? (
            <div className="h4" style={{ marginLeft: "12px" }}>
              Подтвердите и оплатите
            </div>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{
                width: "300px",
                marginLeft: "12px",
              }}
            />
          )}
        </div>
      )}
      {course.end_day ? (
        <div className="h5" style={{ marginTop: "16px" }}>
          Ваши занятия
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "100px",
            marginTop: "16px",
          }}
        />
      )}
      {course.end_day ? (
        <div className="Body-3" style={{ marginTop: "12px" }}>
          Формат оплаты:
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "130px",
            marginTop: "12px",
          }}
        />
      )}
      {course.end_day ? (
        <div className="Body-2" style={{ marginTop: "8px" }}>
          Оплачивать ежемесячно
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "200px",
            marginTop: "8px",
          }}
        />
      )}
      {course.end_day ? (
        <div className="Body-3" style={{ marginTop: "12px" }}>
          Даты
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "100px",
            marginTop: "12px",
          }}
        />
      )}
      {course.end_day ? (
        <div className="Body-2" style={{ marginTop: "8px" }}>
          Старт обучения:{" "}
          {firstActiveDay && firstActiveDay.format("DD MMMM YYYY")}
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "150px",
            marginTop: "8px",
          }}
        />
      )}
      {course.end_day ? (
        <div className="Body-2" style={{ marginTop: "8px" }}>
          Длительность: {startOfMonth} - {endOfMonth}
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "200px",
            marginTop: "8px",
          }}
        />
      )}
    </div>
  );
}
