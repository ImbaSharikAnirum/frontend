import React, { useEffect, useMemo } from "react";
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
import { setInvoice } from "../../redux/reducers/invoiceBookingReducer";

export default function InformationBooking() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id, date } = useParams();
  const dispatch = useDispatch();
  const { data, error } = useFetchCourseByIdQuery(id);
  const course = useSelector(selectCurrentCourse);

  // Convert `date` to a moment object
  const startOfMonth = moment(date, "YYYY-MM");
  const endOfMonth = moment(course.end_day, "YYYY-MM-DD");
  const activeDays = useMemo(
    () => ({
      monday: course.monday,
      tuesday: course.tuesday,
      wednesday: course.wednesday,
      thursday: course.thursday,
      friday: course.friday,
      saturday: course.saturday,
      sunday: course.sunday,
    }),
    [
      course.monday,
      course.tuesday,
      course.wednesday,
      course.thursday,
      course.friday,
      course.saturday,
      course.sunday,
    ]
  );

  useEffect(() => {
    if (data) {
      dispatch(setCourse(data));
    } else if (error) {
      dispatch(setError(error));
    }

    // Устанавливаем счет-фактуру только после загрузки данных
    if (course.end_day) {
      const firstActiveDay = getFirstActiveDayOfMonth(startOfMonth, activeDays);
      const lastActiveDay = getLastActiveDayOfMonth(startOfMonth, activeDays);

      const formattedLastActiveDay = lastActiveDay
        ? lastActiveDay.format("YYYY-MM-DD")
        : null;

      const formattedStartDay = firstActiveDay
        ? firstActiveDay.format("YYYY-MM-DD")
        : null;

      dispatch(
        setInvoice({
          start_day: formattedStartDay,
          end_day: formattedLastActiveDay,
        })
      );
    }

    return () => {
      dispatch(resetCourse());
    };
  }, [data, error, dispatch, course.end_day, startOfMonth, activeDays]);

  const getFirstActiveDayOfMonth = (startOfMonth, activeDays) => {
    const firstDayOfMonth = startOfMonth.clone().startOf("month");
    let firstActiveDay = null;

    for (
      let date = firstDayOfMonth.clone();
      date.isSameOrBefore(firstDayOfMonth.clone().endOf("month"));
      date.add(1, "day")
    ) {
      const dayOfWeek = date.locale("en").format("dddd").toLowerCase();
      if (activeDays[dayOfWeek]) {
        firstActiveDay = date;
        break; // Stop after finding the first active day
      }
    }

    return firstActiveDay;
  };

  const getLastActiveDayOfMonth = (startOfMonth, activeDays) => {
    const lastDayOfMonth = startOfMonth.clone().endOf("month");
    let lastActiveDay = null;

    for (
      let date = lastDayOfMonth.clone();
      date.isSameOrAfter(startOfMonth.clone().startOf("month"));
      date.subtract(1, "day")
    ) {
      const dayOfWeek = date.locale("en").format("dddd").toLowerCase();
      if (activeDays[dayOfWeek]) {
        lastActiveDay = date;
        break; // Stop after finding the last active day
      }
    }

    return lastActiveDay;
  };

  const firstActiveDay = getFirstActiveDayOfMonth(startOfMonth, activeDays);

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
              border: "none",
              cursor: "pointer",
              zIndex: 1000,
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
          {firstActiveDay && firstActiveDay.locale("ru").format("DD MMMM YYYY")}
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
          Длительность: {startOfMonth.format("MMMM YYYY")} -{" "}
          {endOfMonth.format("MMMM YYYY")}
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
