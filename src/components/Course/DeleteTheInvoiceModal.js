import React, { useEffect, useRef } from "react";
import { showFooterMenu } from "../../redux/footerMenuSlice";
import { closeDeleteInvoiceModal } from "../../redux/reducers/modalReducer";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDeleteInvoiceMutation } from "../../redux/services/invoiceAPI";
import {
  setStudents,
  selectStudents,
} from "../../redux/reducers/courseTableReducer"; // Импортируем действия и селекторы студентов

export default function DeleteTheInvoiceModal() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const modalRef = useRef(null);

  // Получаем данные студента из состояния Redux
  const student = useSelector((state) => state.modals.studentData);
  const students = useSelector(selectStudents); // Получаем текущих студентов

  // Мутация для удаления счета
  const [deleteInvoice] = useDeleteInvoiceMutation();

  // Закрытие модалки при клике вне области модалки
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        dispatch(closeDeleteInvoiceModal());
        dispatch(showFooterMenu());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  // Обработчик для удаления счета
  const handleDeleteClick = async () => {
    // 1. Оптимистически убираем ученика из списка
    const updatedStudents = students.filter(
      (s) => s.invoiceId !== student.invoiceId
    );
    dispatch(setStudents(updatedStudents)); // Обновляем список студентов сразу

    // 2. Закрываем модалку
    dispatch(closeDeleteInvoiceModal());
    dispatch(showFooterMenu());

    try {
      // 3. Отправляем запрос на удаление счета
      await deleteInvoice(student.invoiceId);
      toast.success("Счет успешно удален"); // Успешное уведомление
    } catch (error) {
      // В случае ошибки можно показать уведомление
      toast.error("Ошибка при удалении счета");
      console.error("Ошибка при удалении счета:", error);
    }
  };

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
                  dispatch(closeDeleteInvoiceModal());
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
              <div className="h5">Вы точно хотите удалить счет?</div>
            </div>
            <div className="" style={{ padding: "16px" }}>
              <div className="Body-2" style={{ height: "40px" }}>
                Ученик <strong>{student?.name}</strong> будет удален с
                выбранного месяца.
              </div>
            </div>
          </div>
          <div
            className="modal-buttons"
            style={{ alignItems: "flex-end", justifyContent: "right" }}
          >
            <button
              className="button_secondary Body-3 button-animate-filter"
              onClick={handleDeleteClick} // Вызов функции удаления
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
