import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/reducers/authReducer";
import { ReactComponent as More } from "../../images/more.svg";
import { useDispatch } from "react-redux";
import {
  openDeleteInvoiceModal,
  openEditSumModal,
  openStudentDataModal,
} from "../../redux/reducers/modalReducer";
import { hideFooterMenu } from "../../redux/footerMenuSlice";

export default function MoreTable({ student }) {
  const ManagerId = process.env.REACT_APP_MANAGER;
  const user = useSelector(selectCurrentUser);
  // Состояние для отображения модалки
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalRef = useRef(null);
  const buttonRef = useRef(null);

  // Состояние для хранения позиции кнопки
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Переключение отображения модалки
  const handleModalToggle = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setModalPosition({
        top: buttonRect.bottom + window.scrollY, // нижняя граница кнопки + скролл
        left: buttonRect.left + window.scrollX - 180, // левая граница кнопки + скролл
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
    if (option === "Данные ученика") {
      dispatch(openStudentDataModal(student));
    } else if (option === "Удалить счет") {
      dispatch(openDeleteInvoiceModal(student));
    } else if (option === "Изменить сумму") {
      dispatch(openEditSumModal(student)); // Открываем модалку для редактирования суммы
    }
    dispatch(hideFooterMenu());
  };

  // Модальное окно, рендерится через портал

  return (
    <div style={{ flex: "1", padding: "8px" }}>
        <button
          ref={buttonRef}
          className="button_only_icon button_white button-animate-filter"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "36px",
            width: "36px",
            border: "none",
            cursor: "pointer",
            zIndex: 1000,
          }}
          onClick={handleModalToggle}
        >
          <More style={{ fill: "white" }} />
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
              "Данные ученика",
              user?.role?.id === Number(ManagerId) && "Удалить счет",

              user?.role?.id === Number(ManagerId) && "Изменить сумму",
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
                      marginLeft: "16px",
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
  );
}
