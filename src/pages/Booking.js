import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as Left } from "../images/left.svg";
import { useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFetchCourseByIdQuery } from "../redux/services/courseAPI";
import {
  resetCourse,
  selectCurrentCourse,
  setCourse,
  setError,
} from "../redux/reducers/courseReducer";
import moment from "moment";

export default function Booking() {
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

  const firstActiveDay = getFirstActiveDayOfMonth(startOfMonth, activeDays);
  const modalRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          width: isMobile ? "100%" : "1120px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
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
            <div className="h4" style={{ marginLeft: "12px" }}>
              Подтвердите и оплатите
            </div>
          </div>

          <div className="h5" style={{ marginTop: "16px" }}>
            Ваши занятия
          </div>
          <div className="Body-3" style={{ marginTop: "12px" }}>
            Формат оплаты:
          </div>
          <div className="Body-2" style={{ marginTop: "8px" }}>
            Оплачивать ежемесячно
          </div>
          <div className="Body-3" style={{ marginTop: "12px" }}>
            Даты
          </div>
          <div className="Body-2" style={{ marginTop: "8px" }}>
            Старт обучения:{" "}
            {firstActiveDay && firstActiveDay.format("DD MMMM YYYY")}
          </div>
          <div className="Body-2" style={{ marginTop: "8px" }}>
            Длительность: {startOfMonth} - {endOfMonth}
          </div>
        </div>
        <div
          className="box"
          style={{
            position: "sticky",
            top: scrollTop > 100 ? "10px" : "100px",
            alignSelf: "flex-start",
            transition: "top 0.3s ease",
            marginLeft: "20px",
            marginTop: "16px",
            maxWidth: "50%",
          }}
        >
          <div
            style={{
              width: "500px",
              // height: "320px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            card
          </div>
        </div>
        {/* <div className="Body-3" style={{ marginTop: "12px" }}>
          Оплата:
        </div>
        <div>Оплачивать ежемесячно</div>
        <div>Требуется для записи</div>
        <div>Кто записывает:</div>
        <div>
          <div>Я ученик</div>
          <div>Я родитель</div>
          <div>Я менеджер</div>
        </div>
        <div>Форма</div>
        <div>Правила отмены</div>
        <div>
          Отмена и полный возврат возможны за 2 дня до начала курса. После этого
          срока отмена участия и возврат средств не предусмотрены.
        </div>
        <div>
          Компания не осуществляет перерасчеты и переносы в случае пропуска
          занятия, включая случаи со справкой.
        </div>
        <div>
          При недоборе участников или других препятствиях курсы отменяются с
          возвратом оплаты за несостоявшиеся занятия.
        </div>
        <div>
          Продолжая, вы соглашаетесь с положениями основных документов
          Anirum — Условия предоставления услуг и  Политика конфиденциальности —
          и подтверждаете, что прочли их.
        </div>
        <div>Подтвердить и оплатить</div> */}
      </div>
    </div>
  );
}
