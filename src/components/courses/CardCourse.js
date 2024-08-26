// src/components/courses/CardCourse.js
import React from "react";
import { Link } from "react-router-dom";
import Slider from "../Slider";
import "../../styles/courses.css";
import moment from "moment-timezone";

const CardCourse = ({ course }) => {
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
      ? `${course.city}, ${course.address}`
      : "Онлайн";

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
      day.isSameOrBefore(endOfNextMonth);
      day.add(1, "days")
    ) {
      // Получаем день недели в формате 'monday', 'tuesday', и т.д.
      const dayOfWeek = day.format("dddd").toLowerCase(); // Например, "monday"

      // Проверяем, попадает ли день в диапазон курса и совпадает ли он с активным днем недели
      if (
        day.isSameOrAfter(courseStartDate, "day") &&
        day.isSameOrBefore(courseEndDate, "day") &&
        activeDays[dayOfWeek]
      ) {
        lessonCount++;
      }
    }

    return lessonCount;
  };

  const lessonsInNextMonth = countLessonsInNextMonth(course);
  const totalCost = lessonsInNextMonth * course.price_lesson;
  return (
    <div className="card">
      <Slider images={course.image_url} course={course} />
      <Link
        to={`/course/${course.id}`}
        style={{ textDecoration: "none", color: "black" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ height: "35px", width: "35px" }}>
              <img
                src={`${course.teacher.photo}`}
                alt="Аватар"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "90px",
                  border: "1px solid #DDDDDD",
                }}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <div className="Body-3">{course.direction}</div>
              <div className="Body-1" style={{ color: "#5F5F5F" }}>
                {location}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div className="Body-1" style={{ color: "#5F5F5F" }}>
              {courseDays || "Нет занятий"}
            </div>
            <div className="Body-1" style={{ color: "#5F5F5F" }}>
              {timeRange} ({userTimeZone})
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "4px" }}>
              <div className="Body-3">{course.price_lesson} р</div>
              <div className="Body-2">занятие</div>
            </div>
            <div
              className="Body-1"
              style={{ color: "#5F5F5F", textDecoration: "underline" }}
            >
              Всего {totalCost} р
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardCourse;
