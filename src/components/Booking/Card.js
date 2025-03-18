import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import moment from "moment-timezone";
import { useParams } from "react-router-dom";
import { Skeleton, useMediaQuery, useTheme } from "@mui/material";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import {
  selectCurrentInvoice,
  setInvoice,
} from "../../redux/reducers/invoiceBookingReducer";

export default function Card() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const course = useSelector(selectCurrentCourse);
  const dayOfWeek = [
    { fullName: "Понедельник", shortName: "Пн", value: course.monday },
    { fullName: "Вторник", shortName: "Вт", value: course.tuesday },
    { fullName: "Среда", shortName: "Ср", value: course.wednesday },
    { fullName: "Четверг", shortName: "Чт", value: course.thursday },
    { fullName: "Пятница", shortName: "Пт", value: course.friday },
    { fullName: "Суббота", shortName: "Сб", value: course.saturday },
    { fullName: "Воскресенье", shortName: "Вс", value: course.sunday },
  ];

  const activeDays = dayOfWeek.filter((day) => day.value);

  const courseDays =
    activeDays.length >= 3
      ? activeDays.map((day) => day.shortName).join(", ")
      : activeDays.map((day) => day.fullName).join(", ");

  // Таймзона пользователя
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Преобразуем время в таймзону пользователя
  const userStartTime = moment
    .tz(course.start_time, "HH:mm:ss.SSS", course.time_zone)
    .tz(userTimeZone)
    .format("HH:mm");

  const userEndTime = moment
    .tz(course.end_time, "HH:mm:ss.SSS", course.time_zone)
    .tz(userTimeZone)
    .format("HH:mm");

  // Отображение времени группы и таймзоны пользователя
  const timeRange = `${userStartTime} - ${userEndTime}`;
  const location =
    course.format === "Оффлайн"
      ? `${course.city}, ${course.district}`
      : "Онлайн";

  const { id, date } = useParams();
  const monthName = moment(date, "YYYY-MM").locale("ru").format("MMMM");

  const getMonthInGenitive = (month) => {
    const months = {
      январь: "январе",
      февраль: "феврале",
      март: "марте",
      апрель: "апреле",
      май: "мае",
      июнь: "июне",
      июль: "июле",
      август: "августе",
      сентябрь: "сентябре",
      октябрь: "октябре",
      ноябрь: "ноябре",
      декабрь: "декабре",
    };

    return months[month];
  };

  const monthNameGenitive = getMonthInGenitive(monthName);

  const message = `Занятий в ${monthNameGenitive}`;

  const countLessonsInNextMonth = (course, date) => {
    // Определяем текущую дату и следующий месяц
    const startOfNextMonth = moment(date).clone().startOf("month");
    const endOfNextMonth = moment(date).clone().endOf("month");
    // Преобразование строковых дат в объекты moment
    const courseStartDate = moment(course.start_day);
    const courseEndDate = moment(course.end_day);
    // Определяем дни недели, когда проходят занятия
    const activeDays = {
      monday: course.monday,
      tuesday: course.tuesday,
      wednesday: course.wednesday,
      thursday: course.thursday,
      friday: course.friday,
      saturday: course.saturday,
      sunday: course.sunday,
    };

    let lessonCount = 0;
    // Итерируем по каждому дню в следующем месяце
    for (
      let day = startOfNextMonth.clone();
      day.locale("en").isSameOrBefore(endOfNextMonth);
      day.add(1, "days")
    ) {
      // Получаем день недели в формате 'monday', 'tuesday', и т.д.
      const dayOfWeek = day.locale("en").format("dddd").toLowerCase(); // Например, "monday"
      // Проверяем, попадает ли день в диапазон курса и совпадает ли он с активным днем недели
      if (
        day.locale("en").isSameOrAfter(courseStartDate, "day") &&
        day.locale("en").isSameOrBefore(courseEndDate, "day") &&
        activeDays[dayOfWeek]
      ) {
        lessonCount++;
      }
    }

    return lessonCount;
  };

  const lessonsInNextMonth = countLessonsInNextMonth(course, date);
  const totalCost = lessonsInNextMonth * course.price_lesson;
  const ManagerId = process.env.REACT_APP_MANAGER;
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const initialTotalCost = lessonsInNextMonth * course.price_lesson;

  const [sum, setSum] = useState(""); // Default value of 0
  useEffect(() => {
    if (course && lessonsInNextMonth !== undefined) {
      const initialTotalCost = lessonsInNextMonth * course.price_lesson;
      setSum(initialTotalCost); // Устанавливаем начальную сумму
    }
  }, [course, lessonsInNextMonth]);
  // Обновляем Redux при изменении суммы
  useEffect(() => {
    dispatch(
      setInvoice({
        currency: "руб",
        sum: sum,
        status_payment: false,
        group: course.id,
      })
    );
  }, [sum, dispatch, course, user]);

  const handleSumChange = (e) => {
    const newSum = e.target.value;

    // Allow empty string to enable clearing the input
    setSum(newSum === "" ? "" : Number(newSum));
  };

  const urlAvatar =
    course?.teacher?.photo?.small ||
    course?.teacher?.photo?.medium ||
    course?.teacher?.photo?.original;
  return (
    <div
      style={{
        width: "100%",
        // height: "320px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}
      >
        <div
          style={{
            width: isMobile ? "100%" : "150px",
            height: "150px",
          }}
        >
          {course?.images[0] ? (
            <img
              src={`${course?.images[0].original}`}
              alt="Курс"
              className="slide-image"
              style={{
                boxShadow:
                  "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0",
                border: "none",
                borderRadius: "16px",
              }}
            />
          ) : (
            <Skeleton
              className="slide-image"
              variant="rectangular"
              style={{
                marginTop: "0px",
                boxShadow:
                  "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0",
                border: "none",
                borderRadius: "16px",
                height: "150px",
              }}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginLeft: isMobile ? "0px" : "20px",
            marginTop: isMobile ? "16px" : "0px",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ height: "35px", width: "40px" }}>
              {urlAvatar ? (
                <img
                  src={`${urlAvatar}`}
                  alt="Аватар"
                  style={{
                    width: "35px",
                    height: "35px",
                    objectFit: "cover",
                    borderRadius: "90px",
                    border: "1px solid #DDDDDD",
                  }}
                />
              ) : (
                <Skeleton
                  variant="rectangular"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "90px",
                  }}
                />
              )}
            </div>

            {course.direction ? (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                <div className="Body-3">{course.direction}</div>
                <div className="Body-1" style={{ color: "#5F5F5F" }}>
                  {location}
                </div>
              </div>
            ) : (
              <Skeleton
                variant="rectangular"
                style={{
                  width: "150px",
                  // height: "100%",
                }}
              />
            )}
          </div>
          {courseDays ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                // marginTop: "26px",
              }}
            >
              <div className="Body-1" style={{ color: "#5F5F5F" }}>
                {courseDays || "Нет занятий"}
              </div>
              <div className="Body-1" style={{ color: "#5F5F5F" }}>
                {timeRange} ({userTimeZone})
              </div>
            </div>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{
                width: "150px",
              }}
            />
          )}
        </div>
      </div>
      <div
        style={{
          borderBottom: "1px solid #CDCDCD",
          marginTop: "16px",
        }}
      ></div>
      {course.price_lesson ? (
        <div className="Body-3" style={{ marginTop: "16px" }}>
          Детализация цены
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "150px",
            marginTop: "16px",
          }}
        />
      )}{" "}
      {course.price_lesson ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <div style={{ display: "flex" }}>
            <div className="Body-2">Цена занятия</div>
          </div>
          <div className="Body-2">
            {course.price_lesson} р{/* Всего {totalCost} р */}
          </div>
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "100%",
            marginTop: "16px",
          }}
        />
      )}{" "}
      {course.price_lesson ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <div style={{ display: "flex" }}>
            <div className="Body-2">{message}</div>
          </div>
          <div className="Body-2">{lessonsInNextMonth}</div>
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "100%",
            marginTop: "16px",
          }}
        />
      )}{" "}
      {course.price_lesson ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <div style={{ display: "flex" }}>
            <div className="Body-2">
              {course.price_lesson} р х {lessonsInNextMonth} занятия
            </div>
          </div>
          <div className="Body-2">{totalCost} р</div>
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "100%",
            marginTop: "16px",
          }}
        />
      )}
      <div
        style={{
          borderBottom: "1px solid #CDCDCD",
          marginTop: "16px",
        }}
      ></div>{" "}
      {course.price_lesson ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "12px",
          }}
        >
          <div style={{ display: "flex" }}>
            <div className="Body-3">Всего</div>
          </div>
          <div className="Body-3">{totalCost} р</div>
        </div>
      ) : (
        <Skeleton
          variant="rectangular"
          style={{
            width: "100%",
            marginTop: "16px",
          }}
        />
      )}{" "}
      {Number(ManagerId) === user?.role?.id && (
        <div>
          {course.price_lesson ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", marginTop: "24px" }}>
                <div className="Body-3">Можете поменять сумму</div>
              </div>

              <div className="input_default_border" style={{ width: "120px" }}>
                <input
                  className="input_default"
                  style={{ width: "60px" }}
                  placeholder="Сумма"
                  type="number"
                  name="totalCost"
                  required
                  value={sum} // This will allow '' (empty) to be the value
                  onChange={handleSumChange} // Обработчик изменения
                />
              </div>
            </div>
          ) : (
            <Skeleton
              variant="rectangular"
              style={{
                width: "100%",
                marginTop: "16px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
