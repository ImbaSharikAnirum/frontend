import { useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import moment from "moment";
import "moment/locale/ru";
import { ReactComponent as Smile } from "../../images/information/smile.svg";
import { ReactComponent as Clock } from "../../images/information/clock.svg";
import { ReactComponent as Calendar } from "../../images/information/calendar.svg";
import { ReactComponent as Circle } from "../../images/information/circle.svg";
import { ReactComponent as Flag } from "../../images/information/flag.svg";
import { ReactComponent as Highlight } from "../../images/information/highlight.svg";
import { ReactComponent as Trendingup } from "../../images/information/trendingup.svg";
import { ReactComponent as Clipboard } from "../../images/information/clipboard.svg";

export default function Information() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const course = useSelector(selectCurrentCourse);
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

  const formattedDate = moment(course.end_day)
    .format("MMMM YYYY")
    .replace("ь ", "я ");

  moment.locale("ru"); // Устанавливаем локаль

  return (
    <div>
      {isMobile && (
        <div>
          {course.format === "Оффлайн" ? (
            <div
              className="Body-1"
              style={{
                display: "flex",
              }}
            >
              г. {course.city}, {course.district}, ул. {course.address}
            </div>
          ) : (
            <div
              className="Body-1"
              style={{
                alignItems: "center",
              }}
            >
              {course.format}
            </div>
          )}
        </div>
      )}
      <div
        className="h4"
        style={{
          marginTop: "12px",
        }}
      >
        {course.direction}
      </div>
      <div
        className="Body-2"
        style={{
          marginTop: "12px",
        }}
      >
        {course.description}
      </div>

      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #CDCDCD",
          marginTop: "16px",
        }}
      ></div>

      <div
        className="h4"
        style={{
          marginTop: "12px",
        }}
      >
        Расписание и Возраст
      </div>

      <div
        className="Body-2"
        style={{
          marginTop: "12px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Smile />
        <div
          style={{
            marginLeft: "8px",
          }}
        >
          Возраст: {course.age_start} - {course.age_end} лет
        </div>
      </div>
      <div
        className="Body-2"
        style={{
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Clock />
        <div
          style={{
            marginLeft: "8px",
          }}
        >
          Время: {timeRange} ({userTimeZone})
        </div>
      </div>
      <div
        className="Body-2"
        style={{
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Calendar />
        <div
          style={{
            marginLeft: "8px",
          }}
        >
          Дни недели: {courseDays || "Нет занятий"}
        </div>
      </div>
      <div
        className="Body-2"
        style={{
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Circle />
        <div
          style={{
            marginLeft: "8px",
          }}
        >
          Язык: {course.language}
        </div>
      </div>
      <div
        className="Body-2"
        style={{
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Flag />
        <div
          style={{
            marginLeft: "8px",
          }}
        >
          Длительность: до {formattedDate}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #CDCDCD",
          marginTop: "16px",
        }}
      ></div>

      <div
        className="h4"
        style={{
          marginTop: "12px",
        }}
      >
        Обучение
      </div>
      <div
        className="Body-2"
        style={{
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Trendingup />
        <div
          style={{
            marginLeft: "8px",
          }}
        >
          Сложность: {course.level}
        </div>
      </div>
      <div
        className="Body-2"
        style={{
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Highlight />

        <div
          style={{
            marginLeft: "8px",
          }}
        >
          {course.inventory
            ? "Инвентарь предоставляется"
            : "Нужен свой инвентарь"}
        </div>
      </div>
      <div
        className="Body-2"
        style={{
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ height: "20px", width: "20px" }}>
          <Clipboard />
        </div>

        <div
          style={{
            marginLeft: "8px",
          }}
        >
          Инвентарь: {course.items}
        </div>
      </div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #CDCDCD",
          marginTop: "16px",
        }}
      ></div>
    </div>
  );
}
