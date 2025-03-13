import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "react-responsive";
import { hideFooterMenu, showFooterMenu } from "../../redux/footerMenuSlice";
// import { useDeleteGuideMutation } from "../../redux/services/guideAPI";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useDeleteGuideMutation } from "../../redux/services/guidesAPI";
import { useNavigate } from "react-router-dom";

export default function GuideDeleteModal({ onClose }) {
  const { id } = useParams();

  const modalRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteGuide] = useDeleteGuideMutation();
  // Скрываем футер при открытии модалки, возвращаем его при закрытии
  useEffect(() => {
    dispatch(hideFooterMenu());
    return () => {
      dispatch(showFooterMenu());
    };
  }, [dispatch]);
  // Закрытие модального окна при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Обработчик удаления гайда
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteGuide(id); // Если требуется передать id, добавьте его в вызов
      toast.success("Гайд успешно удален");
      onClose();
      navigate(`/guides`);
    } catch (error) {
      toast.error("Ошибка при удалении гайда");
      console.error("Ошибка при удалении гайда:", error);
    } finally {
      setIsLoading(false);
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
                onClick={onClose}
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
              <div className="h5">Вы точно хотите удалить гайд?</div>
            </div>
            <div style={{ padding: "16px" }}>
              <div className="Body-2" style={{ height: "40px" }}>
                Гайд будет удален навсегда.
              </div>
            </div>
          </div>
          <div
            className="modal-buttons"
            style={{ alignItems: "flex-end", justifyContent: "right" }}
          >
            <button
              className="button_secondary Body-3 button-animate-filter"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Удаление..." : "Удалить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
