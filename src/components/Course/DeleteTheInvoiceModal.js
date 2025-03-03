import React, { useEffect, useRef, useState } from "react";
import { showFooterMenu } from "../../redux/footerMenuSlice";
import { closeDeleteInvoiceModal } from "../../redux/reducers/modalReducer";
import { useDispatch, useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDeleteInvoiceMutation } from "../../redux/services/invoiceAPI";

export default function DeleteTheInvoiceModal() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const modalRef = useRef(null);

  // Получаем данные студента из состояния Redux
  const student = useSelector((state) => state.modals.studentData);

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
  const [isLoading, setIsLoading] = useState(false);

  // Обработчик для удаления счета
  const handleDeleteClick = async () => {
    setIsLoading(true); // Показываем лоадинг
    try {
      await deleteInvoice(student.invoiceId);
      toast.success("Счет успешно удален");
      dispatch(closeDeleteInvoiceModal()); // ✅ Закрываем только после успешного удаления
      dispatch(showFooterMenu());
    } catch (error) {
      toast.error("Ошибка при удалении счета");
      console.error("Ошибка при удалении счета:", error);
    } finally {
      setIsLoading(false); // Выключаем лоадинг
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
              onClick={handleDeleteClick}
              disabled={isLoading} // Делаем кнопку неактивной при загрузке
            >
              {isLoading ? "Удаление..." : "Удалить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
