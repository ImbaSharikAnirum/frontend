import React, { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { hideFooterMenu, showFooterMenu } from "../../redux/footerMenuSlice";
import { useDispatch } from "react-redux";

export default function DeleteSkillTreeModal({
  onCancel,
  onConfirm,
  isDeleting,
}) {
  const modalRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hideFooterMenu());
    return () => dispatch(showFooterMenu());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  return (
    <div
      style={{
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 999,
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
          style={{
            margin: "auto",
            width: "400px",
            borderRadius: "20px",
            backgroundColor: "#fff",
            padding: "24px",
          }}
        >
          <div className="h5" style={{ marginBottom: "16px" }}>
            Вы точно хотите удалить ветку?
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="button_secondary Body-3" onClick={onCancel}>
              Отмена
            </button>
            <button
              className="button_secondary Body-3 button-animate-filter"
              style={{
                marginLeft: "16px",
                backgroundColor: "#ff5a5a",
                color: "#fff",
              }}
              onClick={onConfirm}
            >
              {isDeleting ? "Удаление..." : "Удалить"}{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
