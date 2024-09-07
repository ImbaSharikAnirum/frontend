import React, { useState, useEffect } from "react";
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

const ActiveDatesList = ({
  studentIndex,
  courseId,
  startOfMonth,
  endOfMonth,
  student,
}) => {
  const activeDates = useSelector(selectActiveDates);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [createActivity] = useCreateActivityMutation();
  const [updateActivity] = useUpdateActivityMutation();
  const [timerId, setTimerId] = useState(null); // Храним ID таймера для запроса

  useEffect(() => {
    const initialStatus = {};
    activeDates.forEach((date) => {
      const formattedDate = moment(date, "D MMM");
      const activityForDate = student.activities.find((activity) =>
        moment(activity.attributes.date).isSame(formattedDate, "day")
      );

      if (activityForDate) {
        initialStatus[date] = activityForDate.attributes.status === "Пришел"
          ? "check"
          : activityForDate.attributes.status === "Не пришел"
          ? "x"
          : "empty";
      } else {
        initialStatus[date] = "empty";
      }
    });
    setAttendanceStatus({ [studentIndex]: initialStatus });
  }, [activeDates, studentIndex, student.activities]);

  const handleStatusChange = (date) => {
    // Если таймер уже существует, сбрасываем его
    if (timerId) {
      clearTimeout(timerId);
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
      const newTimerId = setTimeout(() => {
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
        setTimerId(null);
      }, 1000); // Задержка 1 секунда

      setTimerId(newTimerId); // Сохраняем ID таймера

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
      {activeDates.map((date, index) => (
        <div
          key={index}
          className="Body-3"
          style={{
            flex: "1",
            padding: "8px",
            justifyContent: "center",
            display: "flex",
            minWidth: "60px",
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

export default ActiveDatesList;
