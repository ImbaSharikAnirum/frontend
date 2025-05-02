import { Paper, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCoursesFromAPI } from "../../redux/coursesSlice";
import DirectionFilter from "../../components/courses/DirectionFilter";
import FormatFilter from "../../components/courses/FormatFilter";
import AgeInput from "../../components/courses/AgeInput";
import FilterGroup from "../../components/courses/FilterGroup";
import moment from "moment-timezone";
import "../../styles/courses.css";

const GroupsBlock = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);
  const filter = useSelector((state) => state.filter);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (fetching) {
      dispatch(fetchCoursesFromAPI(currentPage))
        .then(({ courses: newCourses, totalCount: newTotalCount }) => {
          setTotalCount(newTotalCount);
          setCurrentPage((prevPage) => prevPage + 1);
        })
        .finally(() => {
          setFetching(false);
          setLoading(false);
        });
    }
  }, [fetching, currentPage, dispatch]);

  useEffect(() => {
    setCurrentPage(1);
    setFetching(true);
  }, [filter]);

  const getCourseDays = (course) => {
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
    return activeDays.length >= 3
      ? activeDays.map((day) => day.shortName).join(", ")
      : activeDays.map((day) => day.fullName).join(", ");
  };

  const getTimeRange = (course) => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const userStartTime = moment
      .tz(course.start_time, "HH:mm:ss.SSS", course.time_zone)
      .tz(userTimeZone)
      .format("HH:mm");
    const userEndTime = moment
      .tz(course.end_time, "HH:mm:ss.SSS", course.time_zone)
      .tz(userTimeZone)
      .format("HH:mm");
    return `${userStartTime} - ${userEndTime} (${userTimeZone})`;
  };

  const getLocation = (course) => {
    return course.format === "Оффлайн"
      ? `${course.city}, ${course.district}`
      : "Онлайн";
  };

  const countLessonsInNextMonth = (course) => {
    const now = moment();
    const startOfNextMonth = now.clone().add(1, "months").startOf("month");
    const endOfNextMonth = now.clone().add(1, "months").endOf("month");
    const courseStartDate = moment(course.start_day);
    const courseEndDate = moment(course.end_day);
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
    for (
      let day = startOfNextMonth.clone();
      day.locale("en").isSameOrBefore(endOfNextMonth);
      day.add(1, "days")
    ) {
      const dayOfWeek = day.locale("en").format("dddd").toLowerCase();
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

  return (
    <Paper
      elevation={3}
      sx={{
        width: "300px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Фильтры */}
        <Box
          sx={{
            p: 2,
            position: "relative",
            "& > div": {
              width: "100%",
              "& > button": {
                width: "100%",
                justifyContent: "flex-start",
                textTransform: "none",
                color: "text.secondary",
              },
            },
            "& > div:not(:last-child)": {
              mb: 2,
            },
            "& .dropdown": {
              position: "fixed",
              top: "auto",
              left: "auto",
              right: "auto",
              bottom: "auto",
              transform: "none",
              marginTop: "8px",
            },
          }}
        >
          <DirectionFilter loading={loading} />
          <FormatFilter loading={loading} />
          <AgeInput loading={loading} />
          <FilterGroup loading={loading} />
        </Box>

        {/* Список курсов */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2 }}>
          {courses.map((course) => {
            const lessonsInNextMonth = countLessonsInNextMonth(course);
            const totalCost = lessonsInNextMonth * course.price_lesson;

            return (
              <Box
                key={course.id}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                {/* Заголовок с аватаром */}
                <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                  <Box sx={{ display: "grid", gap: 0.5 }}>
                    <Box className="Body-3">{course.direction}</Box>
                    <Box className="Body-1" sx={{ color: "#5F5F5F" }}>
                      {getLocation(course)}
                    </Box>
                  </Box>
                </Box>

                {/* Расписание */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    mb: 1.5,
                  }}
                >
                  <Box className="Body-1" sx={{ color: "#5F5F5F" }}>
                    {getCourseDays(course) || "Нет занятий"}
                  </Box>
                  <Box className="Body-1" sx={{ color: "#5F5F5F" }}>
                    {getTimeRange(course)}
                  </Box>
                </Box>

                {/* Цена */}
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <Box className="Body-3">{course.price_lesson} р</Box>
                    <Box className="Body-2">занятие</Box>
                  </Box>
                  <Box
                    className="Body-1"
                    sx={{ color: "#5F5F5F", textDecoration: "underline" }}
                  >
                    Всего {totalCost} р
                  </Box>
                </Box>
              </Box>
            );
          })}

          {!loading && courses.length === 0 && (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Box className="h4" sx={{ mb: 1 }}>
                Нет подходящих занятий
              </Box>
              <Box className="Body-2" sx={{ color: "text.secondary" }}>
                Попробуйте скорректировать или удалить некоторые фильтры.
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default GroupsBlock;
