import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "react-responsive";
import { hideFooterMenu, showFooterMenu } from "../../redux/footerMenuSlice";
import { useDispatch } from "react-redux";
import { useCreateCreationMutation } from "../../redux/services/guidesAPI";
import { ReactComponent as Download } from "../../images/Download.svg";

export default function CreationUploadModal({ guideId, onClose }) {
  const modalRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createCreation] = useCreateCreationMutation();

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

  const onDrop = (acceptedFiles) => {
    const droppedFile = acceptedFiles[0];
    if (!droppedFile) return;

    const isImage = droppedFile.type.startsWith("image/");
    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    const isValidExtension = validTypes.includes(droppedFile.type);
    const isValidSize = isImage && droppedFile.size <= 20 * 1024 * 1024; // 20MB

    if (!isValidExtension) {
      setError("Недопустимый тип файла. Разрешены PNG, JPG, JPEG.");
      return;
    }
    if (!isValidSize) {
      setError("Файл превышает допустимый размер (20MB).");
      return;
    }

    setError("");
    setFile(URL.createObjectURL(droppedFile));
    setFileObject(droppedFile);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
  });
  const handleRemoveFile = () => {
    setFile(null);
    setFileObject(null);
  };

  // Функция отправки одного запроса: загрузка файла и привязка relation
  const handleUpload = async () => {
    if (!fileObject) {
      toast.error("Пожалуйста, выберите изображение для загрузки");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    // Ключ "files" используется, как в примере CreateGuide
    formData.append("files", fileObject);
    // Передаём id родительской записи (relation) напрямую
    formData.append("guide", guideId);
    try {
      await createCreation(formData).unwrap();
      toast.success("Работа успешно загружена");
      onClose();
    } catch (error) {
      toast.error("Ошибка при загрузке работы");
      console.error("Ошибка при загрузке:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100%",
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
                  overflowY: "auto",
                  backgroundColor: "#fff",
                }
              : {
                  margin: "auto",
                  width: "600px",
                  borderRadius: "20px",
                  backgroundColor: "#fff",
                }
          }
        >
          <div style={{ padding: "16px" }}>
            <div
              className="modal-filter"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div className="h5">Загрузить свою работу</div>
            </div>
            {error && (
              <div
                className="Body-3"
                style={{ color: "red", marginTop: "8px" }}
              >
                {error}
              </div>
            )}
            <div
              style={{
                marginTop: "16px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {file ? (
                <div
                  style={{
                    position: "relative",
                    border: "2px solid #ccc",
                    borderRadius: "10px",
                    padding: "10px",
                    textAlign: "center",
                    width: "300px",
                    height: "300px",
                  }}
                >
                  <img
                    src={file}
                    alt="Uploaded"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      borderRadius: "10px",
                    }}
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="button_close Body-3 button-animate-filter"
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "white",
                      border: "none",
                      fontSize: "24px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  style={{
                    backgroundColor: "#E9E9E9",
                    width: "300px",
                    height: "400px",
                    border: "2px dashed #ccc",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <input
                    {...getInputProps()}
                    accept="image/png, image/jpg, image/jpeg"
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      flexGrow: 1,
                      marginBottom: "12px",
                    }}
                  >
                    <Download
                      style={{ height: "24px", marginBottom: "12px" }}
                    />
                    <div style={{ width: "200px" }} className="Body-2">
                      Выберите файл или перетащите его сюда
                    </div>
                  </div>
                  <div
                    className="Body-2"
                    style={{ fontSize: "12px", marginTop: "auto" }}
                  >
                    Рекомендуем использовать файлы высокого качества в формате
                    .jpg (размером меньше 20MB)
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <button
                className="button_secondary Body-3 button-animate-filter"
                onClick={onClose}
              >
                Отмена
              </button>
              <button
                className={`button_secondary Body-3 ${
                  fileObject ? "button-animate-filter" : ""
                }`}
                onClick={handleUpload}
                disabled={isLoading || !fileObject}
                style={{
                  marginLeft: "16px",
                  backgroundColor: !fileObject ? "#ECECEC" : undefined,
                  color: !fileObject ? "#B5B5B5" : undefined,
                }}
              >
                {isLoading ? "Загрузка..." : "Загрузить"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
