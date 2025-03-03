import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditSumModal } from "../../redux/reducers/modalReducer";
import { showFooterMenu } from "../../redux/footerMenuSlice";
import { useMediaQuery } from "react-responsive";
import { useUpdateInvoiceSumMutation } from "../../redux/services/invoiceAPI";
import {
  setStudents,
  selectStudents,
} from "../../redux/reducers/courseTableReducer"; // Импорт действий и селекторов
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setInvoicesCourseTable } from "../../redux/reducers/invoiceSlice";

export default function EditSumModal() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const modalRef = useRef(null);

  // Получаем данные студента и список студентов из состояния Redux
  const student = useSelector((state) => state.modals.studentData);
  const students = useSelector(selectStudents); // Получаем текущих студентов
  const [isLoading, setIsLoading] = useState(false);

  const [sum, setSum] = useState(student?.sum || ""); // Инициализация суммы студента

  const [updateInvoiceSum] = useUpdateInvoiceSumMutation(); // Мутация для обновления суммы счета

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        dispatch(closeEditSumModal());
        dispatch(showFooterMenu());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const handleSumChange = (e) => {
    const newSum = e.target.value;
    setSum(newSum === "" ? "" : Number(newSum));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // 1. Оптимистически обновляем сумму студента в списке
    // const updatedStudents = students.map((s) =>
    //   s.invoiceId === student.invoiceId ? { ...s, sum: sum } : s
    // );
    // dispatch(setStudents(updatedStudents)); // Обновляем список студентов
    // dispatch(setInvoicesCourseTable(updatedStudents)); // Обновляем список студентов

    // 2. Закрываем модалку

    try {
      // 3. Отправляем запрос на обновление суммы счета
      await updateInvoiceSum({
        invoiceId: student.invoiceId,
        sum: sum,
      });
      toast.success("Сумма успешно изменена");
      dispatch(closeEditSumModal());
      dispatch(showFooterMenu());
    } catch (error) {
      console.error("Ошибка при обновлении суммы:", error);
      toast.success("Ошибка при обновлении суммы");
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
                  dispatch(closeEditSumModal());
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
              <div className="h5">Измените сумму</div>
            </div>
            <div className="" style={{ padding: "16px" }}>
              <div style={{ display: "flex" }}>
                <div className="Body-2">Можете поменять сумму</div>
              </div>

              <div className="input_default_border" style={{ width: "120px" }}>
                <input
                  className="input_default"
                  style={{ width: "60px" }}
                  placeholder="Сумма"
                  type="number"
                  name="totalCost"
                  required
                  value={sum} // Это позволит '' (пустое значение) быть допустимым
                  onChange={handleSumChange} // Обработчик изменения
                />
              </div>
            </div>
          </div>
          <div
            className="modal-buttons"
            style={{ alignItems: "flex-end", justifyContent: "right" }}
          >
            <button
              className="button_secondary Body-3 button-animate-filter"
              onClick={handleSave} // Вызов обработчика сохранения
            >
              {isLoading ? "Изменение..." : "Изменить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
