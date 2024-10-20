import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { ReactComponent as EditForm } from "../../images/edit_form.svg";
import { useDispatch } from "react-redux";
import { hideFooterMenu } from "../../redux/footerMenuSlice";
import { selectStudents } from "../../redux/reducers/courseTableReducer";
import { toast } from "react-toastify";

export default function Edit() {
  const ManagerId = process.env.REACT_APP_MANAGER;
  const TeacherId = process.env.REACT_APP_TEACHER;
  const user = useSelector(selectCurrentUser);
  // Состояние для отображения модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  const course = useSelector(selectCurrentCourse);
  const students = useSelector(selectStudents);

  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  // Состояние для хранения позиции кнопки
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

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
  const dispatch = useDispatch();
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

  // Обработка выбора опции
  const handleOptionSelect = (option) => {
    setIsModalOpen(false);
    if (option === "Выставить счет всем") {
    } else if (option === "Удалить счет") {
    } else if (option === "Копировать список группы") {
      const studentsList = students
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
                  width: "180px",
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
                      "Выставить счет всем",

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
