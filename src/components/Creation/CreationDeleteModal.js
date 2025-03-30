// CreationDeleteModal.js
import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";
import { hideFooterMenu, showFooterMenu } from "../../redux/footerMenuSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteCreationMutation } from "../../redux/services/creationAPI";
import { useLazyGetSkillTreeByIdQuery } from "../../redux/services/skillTreeAPI";

export default function CreationDeleteModal({ onClose, user }) {
  const { id } = useParams(); // Используем id из URL
  const modalRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteCreation] = useDeleteCreationMutation();
  const [refetchSkillTree] = useLazyGetSkillTreeByIdQuery();
  const skillTreeId = useSelector((state) => state.skillTree.activeSkillTreeId);

  // Скрываем футер при открытии модального окна
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteCreation(id);
      toast.success("Создание успешно удалено");
      const fallbackId = skillTreeId || localStorage.getItem("lastBranchId");
      if (fallbackId) {
        await refetchSkillTree({ id: fallbackId });
      }
      onClose();
      navigate(`/profile/${user?.id}`);
    } catch (error) {
      toast.error("Ошибка при удалении создания");
      console.error("Ошибка при удалении создания:", error);
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
              <div className="h5">Вы точно хотите удалить креатив?</div>
            </div>
            <div style={{ padding: "16px" }}>
              <div className="Body-2" style={{ height: "40px" }}>
                Креатив будет удалено навсегда.
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
