import React, { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "react-responsive";
import { hideFooterMenu, showFooterMenu } from "../../redux/footerMenuSlice";
import { useDispatch } from "react-redux";
import { ReactComponent as Download } from "../../images/Download.svg";
import { useCreateSkillMutation } from "../../redux/services/skillAPI";

export default function SkillUploadModal({ onClose, onSkillCreated }) {
  const modalRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [fileObject, setFileObject] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createSkill] = useCreateSkillMutation();

  useEffect(() => {
    dispatch(hideFooterMenu());
    return () => {
      dispatch(showFooterMenu());
    };
  }, [dispatch]);

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
    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!validTypes.includes(droppedFile.type)) {
      setError("Недопустимый тип файла. Разрешены PNG, JPG, JPEG.");
      return;
    }
    if (droppedFile.size > 20 * 1024 * 1024) {
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

  const handleUpload = async () => {
    if (!fileObject || !title.trim()) {
      toast.error("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("files", fileObject);
    formData.append("title", title.trim());
    try {
      const response = await createSkill(formData).unwrap();
      toast.success("Скилл успешно создан.");
      // Добавляем префикс, чтобы избежать дублирования ключей
      const newSkill = {
        id: `skill-${response.id}`,
        type: "customSkill",
        position: { x: 0, y: 0 },
        data: {
          label: response.title,
          imageUrl:
            response.image && response.image.length > 0
              ? response.image[0].formats?.medium?.url || response.image[0].url
              : "",
          completed: false,
        },
      };
      onSkillCreated(newSkill);
      onClose();
    } catch (error) {
      toast.error("Ошибка при создании скилла.");
      console.error("Ошибка при создании скилла:", error);
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
              <div className="h5">Добавить скилл</div>
            </div>
            {error && (
              <div
                className="Body-3"
                style={{ color: "red", marginTop: "8px" }}
              >
                {error}
              </div>
            )}
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
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
                    <input {...getInputProps()} />
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
              {/* Центрированный input с небольшим сдвигом вправо */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <input
                  type="text"
                  placeholder="Укажите какой навык будет получен"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input_with_icon Body-3"
                  style={{
                    width: "344px",
                    padding: "8px",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                className="button_secondary Body-3 button-animate-filter"
                onClick={onClose}
              >
                Отмена
              </button>
              <button
                className={`button_secondary Body-3 ${
                  fileObject && title.trim() ? "button-animate-filter" : ""
                }`}
                onClick={handleUpload}
                disabled={isLoading || !(fileObject && title.trim())}
                style={{
                  marginLeft: "16px",
                  backgroundColor: !(fileObject && title.trim())
                    ? "#ECECEC"
                    : undefined,
                  color: !(fileObject && title.trim()) ? "#B5B5B5" : undefined,
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
