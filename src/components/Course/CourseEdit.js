import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { ReactComponent as EditForm } from "../../images/edit_form.svg";
import { useDispatch } from "react-redux";
import { hideFooterMenu } from "../../redux/footerMenuSlice";
import { toast } from "react-toastify";
import { useCreateGroupInvoicesMutation } from "../../redux/services/invoiceAPI";
import moment from "moment";
import {
  selectMonthsWithActiveDays,
  selectNextMonth,
  selectSelectedMonth,
  setNextMonth,
} from "../../redux/reducers/monthReducer";

export default function CourseEdit() {
  const ManagerId = process.env.REACT_APP_MANAGER;
  const TeacherId = process.env.REACT_APP_TEACHER;
  const user = useSelector(selectCurrentUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [createInvoice] = useCreateGroupInvoicesMutation();

  const course = useSelector(selectCurrentCourse);
  const invoices = useSelector((state) => state.invoice.invoicesCourseTable);
  const dispatch = useDispatch();

  const selectedMonth = useSelector(selectSelectedMonth);
  const monthsWithActiveDays = useSelector(selectMonthsWithActiveDays);
  const nextMonth = useSelector(selectNextMonth);


  useEffect(() => {
    if (selectedMonth) {
      const selectedIndex = monthsWithActiveDays.findIndex(
        (m) => m.month === selectedMonth
      );
      if (
        selectedIndex !== -1 &&
        selectedIndex + 1 < monthsWithActiveDays.length
      ) {
        const nextMonth = monthsWithActiveDays[selectedIndex + 1];
        const details = {
          month: moment(nextMonth.month, "MMMM YYYY").format("MMMM YYYY"),
          startDayOfMonth:
            moment(nextMonth.activeDays[0], "DD MMMM YYYY").format(
              "YYYY-MM-DD"
            ) || "",
          endDayOfMonth:
            moment(
              nextMonth.activeDays[nextMonth.activeDays.length - 1],
              "DD-MMMM-YYYY"
            ).format("YYYY-MM-DD") || "",
          sum: course.price_lesson * nextMonth.activeDays.length,
        };
        dispatch(setNextMonth(details));
      } else {
        dispatch(
          setNextMonth({
            month: "",
            startDayOfMonth: "",
            endDayOfMonth: "",
            sum: "",
          })
        );
      }
    }
  }, [selectedMonth, monthsWithActiveDays, course, dispatch]);
  // Переключение отображения модалки
  const toggleOptions = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: buttonRect.bottom + window.scrollY, // нижняя граница кнопки + скролл
        left: buttonRect.left + window.scrollX, // левая граница кнопки + скролл
      });
    }
    setIsModalOpen(!isModalOpen);
  };

  // Закрытие модалки при клике вне ее области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);
  // Проверяем, что активные даты уже существуют
  const startOfMonth = selectedMonth
    ? moment(selectedMonth, "MMMM YYYY").startOf("month").format("YYYY-MM-DD")
    : null;
  const endOfMonth = selectedMonth
    ? moment(selectedMonth, "MMMM YYYY").endOf("month").format("YYYY-MM-DD")
    : null;
  const month = { startOfMonth, endOfMonth };
  const handleOptionSelect = async (option) => {
    setIsModalOpen(false);

    if (option === `Выставить всем счет за ${nextMonth.month}`) {
      try {
        await createInvoice({
          courseId: course.id,
          month: month,
          nextMonth: nextMonth,
        }).unwrap();
        toast.success("Счета успешно выставлены!");
      } catch (error) {
        toast.error("Ошибка при выставлении счетов");
      }
    } else if (option === "Удалить счет") {
    } else if (option === "Копировать список группы") {
      const studentsList = invoices
        .map((student, index) => `${index + 1}) ${student.name}`)
        .join("\n");
      const textToCopy = `Преподаватель: ${course.teacher.name}\nСтуденты:\n${studentsList}`;

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          toast.success("Список студентов скопирован!"); // Уведомление об успешном копировании
        })
        .catch((err) => {
          console.error("Ошибка при копировании текста: ", err);
          toast.error("Ошибка при копировании текста."); // Уведомление об ошибке
        });
    }
    dispatch(hideFooterMenu());
  };
  return (
    <div>
      {course.id &&
        (user?.role?.id === Number(ManagerId) ||
          (user?.role?.id === Number(TeacherId) &&
            user?.id === course?.teacher?.id)) && (
          <div style={{ position: "relative" }}>
            <button
              className="button_white button-animate-filter"
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "8px",
                marginTop: "8px",
              }}
              onClick={toggleOptions}
            >
              <div style={{ marginRight: "4px" }}>
                <EditForm />
              </div>

              <div className="Body-3">Прочее</div>
            </button>
            {isModalOpen && (
              <div
                ref={modalRef}
                style={{
                  position: "absolute",
                  top: modalPosition.top,
                  left: modalPosition.left,
                  zIndex: 1000,
                  backgroundColor: "#fff",
                  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)",
                  borderRadius: "12px",
                  width: "200px",
                  padding: "12px",
                  overflowY: "auto",
                  marginTop: "45px",
                }}
              >
                <ul
                  style={{
                    listStyleType: "none",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {[
                    "Копировать список группы",
                    user?.role?.id === Number(ManagerId) &&
                      nextMonth?.month &&
                      `Выставить всем счет за ${nextMonth.month}`,

                    user?.role?.id === Number(ManagerId) && "Удалить курс",
                  ]
                    .filter(Boolean)
                    .map((option, index) => (
                      <li
                        key={option}
                        onClick={() => handleOptionSelect(option)}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`city-list-item  ${
                          index === hoveredIndex ? "hovered" : ""
                        }`}
                        style={{
                          backgroundColor:
                            index === hoveredIndex ? "#E9E9E9" : "transparent",
                        }}
                      >
                        <div
                          className="Body-3"
                          style={{
                            marginLeft: "8px",
                            marginRight: "8px",
                            fontSize: "16px",
                            color: "#333",
                          }}
                        >
                          {option}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
