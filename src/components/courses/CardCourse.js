// src/components/courses/CardCourse.js
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Slider from "../Slider";
import "../../styles/courses.css";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { selectLanguageCode } from "../../redux/reducers/languageReducer";
import { selectCurrency } from "../../redux/reducers/currencyReducer";

const CardCourse = ({ course }) => {
  console.log("CardCourse received course:", course);
  const { t } = useTranslation();
  const languageCode = useSelector(selectLanguageCode);
  const currency = useSelector(selectCurrency);

  const dayOfWeek = [
    {
      fullName: t("days.monday.full"),
      shortName: t("days.monday.short"),
      value: course.monday,
    },
    {
      fullName: t("days.tuesday.full"),
      shortName: t("days.tuesday.short"),
      value: course.tuesday,
    },
    {
      fullName: t("days.wednesday.full"),
      shortName: t("days.wednesday.short"),
      value: course.wednesday,
    },
    {
      fullName: t("days.thursday.full"),
      shortName: t("days.thursday.short"),
      value: course.thursday,
    },
    {
      fullName: t("days.friday.full"),
      shortName: t("days.friday.short"),
      value: course.friday,
    },
    {
      fullName: t("days.saturday.full"),
      shortName: t("days.saturday.short"),
      value: course.saturday,
    },
    {
      fullName: t("days.sunday.full"),
      shortName: t("days.sunday.short"),
      value: course.sunday,
    },
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

  const getLocation = () => {
    if (course.format !== "Оффлайн") return t("filters.format.online");

    // Определяем, нужно ли использовать английскую версию
    const shouldUseEnglish =
      languageCode === "en" || course.original_language !== languageCode;

    const city = shouldUseEnglish
      ? course.city_en
      : course.city_original_language;

    const district = shouldUseEnglish
      ? course.district_en
      : course.district_original_language;
    if (district) {
      return `${city}, ${district}`;
    }
    return `${city}`;
  };

  const location = getLocation();

  // Функция для подсчета количества занятий в следующем месяце
  const countLessonsInNextMonth = (course) => {
    // Определяем текущую дату и следующий месяц
    const now = moment();
    const startOfNextMonth = now.clone().add(1, "months").startOf("month");
    const endOfNextMonth = now.clone().add(1, "months").endOf("month");

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

  const lessonsInNextMonth = countLessonsInNextMonth(course);
  const totalCost = lessonsInNextMonth * course.price_lesson;
  // Функция для получения переведенного названия направления
  const getTranslatedDirection = (direction) => {
    switch (direction) {
      case "Скетчинг":
        return t("filters.direction.sketching");
      case "2D Рисование":
        return t("filters.direction.2dDrawing");
      case "3D Моделирование":
        return t("filters.direction.3dModeling");
      case "Анимация":
        return t("filters.direction.animation");
      default:
        return direction;
    }
  };
  // console.log(course, "course");
  return (
    <div className="card">
      <Slider images={course.image_url} course={course} />
      <Link
        to={`/course/${course.id}`}
        style={{
          textDecoration: "none",
          color: "black",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "100%",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ height: "35px", width: "40px" }}>
              <img
                src={`${course.teacher.photo}`}
                alt="Аватар"
                style={{
                  width: "35px",
                  height: "35px",
                  objectFit: "cover",
                  borderRadius: "90px",
                  border: "1px solid #DDDDDD",
                }}
              />
            </div>
            <div
              style={{ display: "grid", flexDirection: "column", gap: "4px" }}
            >
              <div className="Body-3">
                {getTranslatedDirection(course.direction)}
              </div>
              <div
                className="Body-1"
                style={{
                  marginRight: "12px",
                  color: "#5F5F5F",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {location}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div className="Body-1" style={{ color: "#5F5F5F" }}>
              {courseDays || t("course.noLessons")}
            </div>
            <div className="Body-1" style={{ color: "#5F5F5F" }}>
              {timeRange} ({userTimeZone})
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              <div className="Body-3">
                {course.price_lesson} {currency.symbol}
              </div>
              <div className="Body-2">{t("course.lesson")}</div>
            </div>
            <div
              className="Body-1"
              style={{ color: "#5F5F5F", textDecoration: "underline" }}
            >
              {t("course.total")} {totalCost} {currency.symbol}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardCourse;
