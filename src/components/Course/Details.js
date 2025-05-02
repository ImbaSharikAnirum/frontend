import { Skeleton, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { selectLanguageCode } from "../../redux/reducers/languageReducer";
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
import { useTranslation } from "react-i18next";

export default function Details({ isLoading }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const course = useSelector(selectCurrentCourse);
  const languageCode = useSelector(selectLanguageCode);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { t } = useTranslation();

  const getFormattedAddress = () => {
    if (course.format !== "Оффлайн") return t("filters.format.online");

    // Определяем, нужно ли использовать английскую версию
    const shouldUseEnglish =
      languageCode === "en" || course.original_language !== languageCode;

    // Получаем компоненты адреса в зависимости от языка
    const city = shouldUseEnglish
      ? course.city_en
      : course.city_original_language;
    const district = shouldUseEnglish
      ? course.district_en
      : course.district_original_language;
    const street = shouldUseEnglish
      ? course.route_en
      : course.route_original_language;
    const streetNumber = shouldUseEnglish
      ? course.streetNumber_en
      : course.streetNumber_original_language;

    // Формируем адрес
    const addressParts = [];

    if (city) addressParts.push(shouldUseEnglish ? city : `г. ${city}`);
    if (district) addressParts.push(district);
    if (street || streetNumber) {
      const streetAddress = [street, streetNumber].filter(Boolean).join(" ");
      addressParts.push(
        shouldUseEnglish ? streetAddress : `ул. ${streetAddress}`
      );
    }

    return addressParts.join(", ");
  };

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
    <div style={{ display: "flex", flexDirection: "column" }}>
      {isMobile && (
        <div>
          {isLoading ? (
            <Skeleton
              variant="text"
              width={"100%"}
              height={24} // Совпадает с font-size
              style={{
                lineHeight: "24px", // Задаёт такую же высоту, как у текста
              }}
            />
          ) : (
            <div
              className="Body-1"
              style={{
                display: "flex",
              }}
            >
              {getFormattedAddress()}
            </div>
          )}
        </div>
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "60%" : "30%"}
          height={24} // Совпадает с font-size
          style={{
            marginTop: "12px",
            lineHeight: "24px", // Задаёт такую же высоту, как у текста
          }}
        />
      ) : (
        <div
          className="h4"
          style={{
            marginTop: "12px",
            lineHeight: "24px",
          }}
        >
          {course.direction}
        </div>
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "100%" : "50%"} // Занимает всю ширину как текст
          height="1em" // Совпадает с font-size (зависит от line-height)
          style={{
            marginTop: "12px",
            display: "inline-block", // Делаем поведение похожим на текст
          }}
        />
      ) : (
        <div
          className="Body-2"
          style={{
            marginTop: "12px",
          }}
        >
          {course.description}
        </div>
      )}

      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #CDCDCD",
          marginTop: "16px",
        }}
      ></div>
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "80%" : "30%"}
          height={24} // Совпадает с font-size
          style={{
            marginTop: "12px",
            lineHeight: "24px", // Задаёт такую же высоту, как у текста
          }}
        />
      ) : (
        <div
          className="h4"
          style={{
            marginTop: "12px",
          }}
        >
          Расписание и Возраст
        </div>
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "70%" : "20%"} // Занимает всю ширину как текст
          height="1em" // Совпадает с font-size (зависит от line-height)
          style={{
            marginTop: "12px",
            display: "inline-block", // Делаем поведение похожим на текст
          }}
        />
      ) : (
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
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "70%" : "20%"}
          height="1em" // Совпадает с font-size (зависит от line-height)
          style={{
            marginTop: "12px",
            display: "inline-block", // Делаем поведение похожим на текст
          }}
        />
      ) : (
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
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "70%" : "20%"}
          height="1em" // Совпадает с font-size (зависит от line-height)
          style={{
            marginTop: "8px",
            display: "inline-block", // Делаем поведение похожим на текст
          }}
        />
      ) : (
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
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "70%" : "20%"}
          height="1em" // Совпадает с font-size (зависит от line-height)
          style={{
            marginTop: "8px",
            display: "inline-block", // Делаем поведение похожим на текст
          }}
        />
      ) : (
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
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "70%" : "20%"}
          height="1em" // Совпадает с font-size (зависит от line-height)
          style={{
            marginTop: "8px",
            display: "inline-block", // Делаем поведение похожим на текст
          }}
        />
      ) : (
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
      )}
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #CDCDCD",
          marginTop: "16px",
        }}
      ></div>
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "80%" : "30%"}
          height={24} // Совпадает с font-size
          style={{
            marginTop: "12px",
            lineHeight: "24px", // Задаёт такую же высоту, как у текста
          }}
        />
      ) : (
        <div
          className="h4"
          style={{
            marginTop: "12px",
          }}
        >
          Обучение
        </div>
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "70%" : "40%"}
          height="1em" // Совпадает с font-size (зависит от line-height)
          style={{
            marginTop: "8px",
            display: "inline-block", // Делаем поведение похожим на текст
          }}
        />
      ) : (
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
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "70%" : "40%"}
          height="1em" // Совпадает с font-size (зависит от line-height)
          style={{
            marginTop: "8px",
            display: "inline-block", // Делаем поведение похожим на текст
          }}
        />
      ) : (
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
      )}
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "70%" : "40%"}
          height="1em" // Совпадает с font-size (зависит от line-height)
          style={{
            marginTop: "8px",
            display: "inline-block", // Делаем поведение похожим на текст
          }}
        />
      ) : (
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
      )}
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
