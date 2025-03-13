import React, { useEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { hideFooterMenu, showFooterMenu } from "../../redux/footerMenuSlice";
import { useDispatch } from "react-redux";

export default function NotAuthenticatedModal({ onClose }) {
  const modalRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleRegister = () => {
    navigate("/signup");
    onClose();
  };

  const handleLogin = () => {
    navigate("/login");
    onClose();
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center", // Центрирование по горизонтали
        alignItems: "center", // Центрирование по вертикали
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
                  overflowY: "auto",
                  backgroundColor: "#fff",
                }
              : {
                  height: "400px",
                  margin: "auto",
                  width: "400px",
                  borderRadius: "20px",
                  backgroundColor: "#fff",
                }
          }
        >
          <div
            style={{
              padding: "16px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <div
              className="h4"
              style={{ marginBottom: "40px", padding: "0 40px" }}
            >
              Зарегистрируйтесь в Anirum, чтобы сохранить свою работу
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Центрирование кнопок по горизонтали
                gap: "16px",
                marginTop: "12px",
                width: "100%",
              }}
            >
              <button
                className="button Body-3 button-animate-filter"
                onClick={handleLogin}
                style={{ width: "200px" }}
              >
                Вход
              </button>
              <button
                className="button_secondary Body-3 button-animate-filter"
                onClick={handleRegister}
                style={{ width: "200px" }}
              >
                Регистрация
              </button>
            </div>
            <button
              onClick={onClose}
              className="button_close"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
