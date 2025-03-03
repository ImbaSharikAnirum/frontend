import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as Check } from "../../images/list/check.svg";
import { ReactComponent as X } from "../../images/list/x.svg";
import { ReactComponent as Empty } from "../../images/list/empty.svg";
import { useSelector } from "react-redux";
import { selectActiveDates } from "../../redux/reducers/courseTableReducer";
import {
  useCreateActivityMutation,
  useUpdateActivityMutation,
} from "../../redux/services/activityApi";
import moment from "moment";
import { selectActiveDaysForSelectedMonth } from "../../redux/reducers/monthReducer";

const Activity = ({ studentIndex, student }) => {
  const activeDays = useSelector(selectActiveDaysForSelectedMonth);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [createActivity] = useCreateActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const timersRef = useRef({}); // Хранение таймеров для каждого дня
  useEffect(() => {
    const initialStatus = {};
    activeDays.forEach((date) => {
      const formattedDate = moment(date, "D MMMM YYYY");
      const activityForDate = student.activities.find((activity) =>
        moment(activity.attributes.date).isSame(formattedDate, "day")
      );

      if (activityForDate) {
        initialStatus[date] =
          activityForDate.attributes.status === "Пришел"
            ? "check"
            : activityForDate.attributes.status === "Не пришел"
            ? "x"
            : "empty";
      } else {
        initialStatus[date] = "empty";
      }
    });
    setAttendanceStatus({ [studentIndex]: initialStatus });
  }, [activeDays, studentIndex, student.activities]);

  const handleStatusChange = (date) => {
    // Если таймер уже существует, сбрасываем его
    if (timersRef.current[date]) {
      clearTimeout(timersRef.current[date]);
    }
    // Обновляем статус немедленно для UI
    setAttendanceStatus((prevStatus) => {
      const currentStatus = prevStatus[studentIndex]?.[date] || "empty";
      let newStatus;
      switch (currentStatus) {
        case "empty":
          newStatus = "check";
          break;
        case "check":
          newStatus = "x";
          break;
        case "x":
          newStatus = "empty";
          break;
        default:
          newStatus = "empty";
      }

      // Создаем таймер для отправки запроса через 1 секунду
      timersRef.current[date] = setTimeout(() => {
        const formattedDate = moment(date, "D MMM").format("YYYY-MM-DD");
        const activityForDate = student.activities.find((activity) =>
          moment(activity.attributes.date).isSame(formattedDate, "day")
        );

        if (activityForDate) {
          // Обновляем существующую активность
          updateActivity({
            id: activityForDate.id,
            date: formattedDate,
            invoice: student.invoiceId,
            status:
              newStatus === "check"
                ? "Пришел"
                : newStatus === "x"
                ? "Не пришел"
                : "",
          });
        } else {
          // Создаем новую активность
          createActivity({
            date: formattedDate,
            invoice: student.invoiceId,
            status:
              newStatus === "check"
                ? "Пришел"
                : newStatus === "x"
                ? "Не пришел"
                : "",
          });
        }

        // Очищаем таймер после выполнения
        delete timersRef.current[date];
      }, 1000); // Задержка 1 секунда

      return {
        ...prevStatus,
        [studentIndex]: {
          ...prevStatus[studentIndex],
          [date]: newStatus,
        },
      };
    });
  };

  const renderIcon = (status) => {
    switch (status) {
      case "check":
        return <Check />;
      case "x":
        return <X />;
      default:
        return <Empty />;
    }
  };

  return (
    <>
      {activeDays.map((date, index) => (
        <div
          key={index}
          className="Body-3"
          style={{
            flex: "1",
            padding: "8px",
            justifyContent: "center",
            display: "flex",
            minWidth: "70px",
          }}
        >
          <div
            className="button_only_icon button_white button-animate-filter"
            style={{
              display: "flex",
              alignItems: "center",
              height: "45px",
              width: "30px",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => handleStatusChange(date)}
          >
            {renderIcon(attendanceStatus[studentIndex]?.[date])}
          </div>
        </div>
      ))}
    </>
  );
};

export default Activity;
