import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import {
  closeStudentDataModal,
} from "../../redux/reducers/modalReducer";
import { toast } from "react-toastify";
import { showFooterMenu } from "../../redux/footerMenuSlice";

export default function StudentDataModal() {
  const dispatch = useDispatch();

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const modalRef = useRef(null);
  const student = useSelector((state) => state.modals.studentData);

  const handleСopyClick = () => {
    dispatch(showFooterMenu());
    if (student) {
      const parentData = [
        student.parents_name ? `Имя: ${student.parents_name}` : null,
        student.parents_phone ? `Телефон: ${student.parents_phone}` : null,
        student.parents_email ? `Почта: ${student.parents_email}` : null,
      ].filter(Boolean);

      const studentData = [
        "Ученик:",
        student.name ? `Имя: ${student.name}` : null,
        student.age ? `Возраст: ${student.age}` : null,
        student.phone ? `Телефон: ${student.phone}` : null,
        student.address ? `Адрес: ${student.address}` : null,
        student.email ? `Почта: ${student.email}` : null,
        student.profileID ? `Профиль: ${student.profileID}` : null,
        parentData.length > 0 ? "" : null, // Добавляем пустую строку для разделения, если есть родитель
        parentData.length > 0 ? "Родитель:" : null, // Если есть данные у родителя
        ...parentData, // Вставляем родительские данные, если они есть
      ]
        .filter(Boolean) // Убираем null значения
        .join("\n"); // Объединяем строки с переносом

      navigator.clipboard.writeText(studentData).then(
        () => {
          toast.success("Данные успешно скопированы!");
          dispatch(closeStudentDataModal());
        },
        () => {
          toast.error("Ошибка при копировании данных!");
        }
      );
    }
  };



  useEffect(() => {
    // Функция для предотвращения скролла
    const disableScroll = () => {
      document.body.style.overflow = "hidden";
    };

    // Функция для разрешения скролла
    const enableScroll = () => {
      document.body.style.overflow = "auto"; // Или "visible"
    };

    // Проверяем, открыта ли модалка
    if (student) {
      disableScroll();
    } else {
      enableScroll();
    }

    // Убираем обработчик при размонтировании компонента
    return () => {
      enableScroll();
    };
  }, [student]); // Добавьте student как зависимость

  if (!student) {
    return null; // Возвращаем null, если данных нет
  }

  return (
    <div
      style={{
        height: "56px",
        display: "flex",
        position: "relative",
        zIndex: 999,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="modal-overlay"
        style={isMobile ? { height: "100%", width: "100vw" } : {}}
      >
        <div
          className="modal-content"
          ref={modalRef}
          onClick={(e) => e.stopPropagation()}
          style={
            isMobile
              ? {
                  height: "100%",
                  width: "100%",
                  maxHeight: "100vh",
                  borderRadius: "0px",
                }
              : {}
          }
        >
          <div style={{ flexGrow: 1 }}>
            <div className="modal-filter">
              <button
                className="button_white modal-close-button"
                onClick={() => {
                  dispatch(closeStudentDataModal());
                  dispatch(showFooterMenu());
                }}
                style={{
                  padding: 0,
                  borderRadius: "50%",
                  fontSize: "16px",
                  textAlign: "center",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <div className="h5">✕</div>
              </button>
              <div className="h5">Данные ученика</div>
            </div>
            <div className="modal-body" style={{ padding: "16px" }}>
              <div
                className="input_default Body-2"
                style={{
                  fontSize: "14px",
                }}
              >
                Ученик
              </div>
              <div style={{ display: "flex" }}>
                <div className="Body-3">Имя:</div>
                <div className="Body-2" style={{ marginLeft: "8px" }}>
                  {student.name}{" "}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="Body-3">Возраст:</div>
                <div className="Body-2" style={{ marginLeft: "8px" }}>
                  {student.age}{" "}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="Body-3">Телефон:</div>
                <div className="Body-2" style={{ marginLeft: "8px" }}>
                  {student.phone}{" "}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="Body-3">Адрес:</div>
                <div className="Body-2" style={{ marginLeft: "8px" }}>
                  {student.address}{" "}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="Body-3">Почта:</div>
                <div className="Body-2" style={{ marginLeft: "8px" }}>
                  {student.email}{" "}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="Body-3">Профиль:</div>
                <div className="Body-2" style={{ marginLeft: "8px" }}>
                  {student.profileID}{" "}
                </div>
              </div>
            </div>
            <div className="modal-body" style={{ padding: "16px" }}>
              <div
                className="input_default Body-2"
                style={{
                  fontSize: "14px",
                }}
              >
                Родитель
              </div>
              <div style={{ display: "flex" }}>
                <div className="Body-3">Имя:</div>
                <div className="Body-2" style={{ marginLeft: "8px" }}>
                  {student.parents_name}{" "}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="Body-3">Телефон:</div>
                <div className="Body-2" style={{ marginLeft: "8px" }}>
                  {student.parents_phone}{" "}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div className="Body-3">Почта:</div>
                <div className="Body-2" style={{ marginLeft: "8px" }}>
                  {student.parents_email}{" "}
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal-buttons"
            style={{ alignItems: "flex-end", justifyContent: "right" }}
          >
            <button
              className="button_secondary Body-3 button-animate-filter"
              onClick={handleСopyClick}
            >
              Копировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
