import React, { useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { setMonthsWithActiveDays } from "../../redux/reducers/monthReducer";

export function MonthCalculait() {
  const dispatch = useDispatch();
  const course = useSelector(selectCurrentCourse);

  const months = useMemo(() => {
    if (!course?.start_day || !course?.end_day) return [];

    const startDate = moment(course.start_day).startOf("month");
    const endDate = moment(course.end_day).endOf("month");
    let currentMonth = startDate.clone();

    const monthsArray = [];
    while (currentMonth.isSameOrBefore(endDate, "month")) {
      monthsArray.push(currentMonth.format("MMMM YYYY"));
      currentMonth.add(1, "month");
    }
    return monthsArray;
  }, [course?.start_day, course?.end_day]);

  const getActiveDaysForMonth = useCallback(
    (month) => {
      if (!course) return [];

      const activeDays = {
        monday: course.monday,
        tuesday: course.tuesday,
        wednesday: course.wednesday,
        thursday: course.thursday,
        friday: course.friday,
        saturday: course.saturday,
        sunday: course.sunday,
      };

      const startOfMonth = moment(month, "MMMM YYYY").startOf("month");
      const endOfMonth = moment(month, "MMMM YYYY").endOf("month");
      const daysInMonth = [];

      for (
        let date = startOfMonth.clone();
        date.isSameOrBefore(endOfMonth);
        date.add(1, "day")
      ) {
        const dayOfWeek = date.locale("en").format("dddd").toLowerCase();
        if (activeDays[dayOfWeek]) {
          daysInMonth.push(date.locale("ru").format("D MMMM YYYY"));
        }
      }

      return daysInMonth;
    },
    [course]
  );

  const monthsWithActiveDays = useMemo(() => {
    if (!course) return [];
    return months.map((month) => ({
      month,
      activeDays: getActiveDaysForMonth(month),
    }));
  }, [months, getActiveDaysForMonth, course]);

  useEffect(() => {
    if (monthsWithActiveDays.length > 0) {
      dispatch(setMonthsWithActiveDays(monthsWithActiveDays));
    }
  }, [monthsWithActiveDays, dispatch]);

  return null;
}
