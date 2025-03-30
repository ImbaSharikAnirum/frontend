import React, { useState, useRef, useEffect } from "react";
import {
  useCreateSkillTreeMutation,
  useUpdateSkillTreeMutation,
} from "../../redux/services/skillTreeAPI";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { useMediaQuery } from "react-responsive";
import { hideFooterMenu, showFooterMenu } from "../../redux/footerMenuSlice";
import { useDispatch } from "react-redux";
import { ReactComponent as Download } from "../../images/Download.svg";

export default function SaveSkillTreeModal({
  onCancel,
  onSaveSuccess,
  treeData,
  title: initialTitle,
  branchId,
  imageUrl, // новый проп с URL изображения для редактируемой ветки
  imageId,
}) {
  const modalRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const dispatch = useDispatch();
  const [title, setTitle] = useState(initialTitle || "");
  // Если imageUrl передан, устанавливаем его в качестве начального превью
  const [file, setFile] = useState(imageUrl || null);
  const [fileObject, setFileObject] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createSkillTree] = useCreateSkillTreeMutation();
  const [updateSkillTree] = useUpdateSkillTreeMutation();

  useEffect(() => {
    dispatch(hideFooterMenu());
    return () => dispatch(showFooterMenu());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onCancel();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCancel]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
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
    },
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

  const handleSave = async () => {
    if (!title.trim() || !treeData) {
      toast.error(
        "Укажите название и убедитесь, что данные ветки присутствуют."
      );
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("treeData", JSON.stringify(treeData));

    // Проверяем, что fileObject является объектом File, а не строкой URL
    if (fileObject instanceof File) {
      formData.append("files", fileObject);
    }
    try {
      if (branchId) {
        await updateSkillTree({ id: branchId, formData }).unwrap();
        toast.success("Ветка успешно обновлена.");
      } else {
        await createSkillTree(formData).unwrap();
        toast.success("Ветка успешно сохранена.");
      }
      onSaveSuccess();
    } catch (err) {
      toast.error("Ошибка при сохранении ветки.");
      console.error(err);
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
        backgroundColor: "rgba(0,0,0,0.5)",
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
              <div className="h5">
                {branchId
                  ? "Обновить ветку SkillTree"
                  : "Сохранить ветку SkillTree"}
              </div>
            </div>
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
                        Выберите изображение ветки или перетащите его сюда
                      </div>
                    </div>
                    <div
                      className="Body-2"
                      style={{ fontSize: "12px", marginTop: "auto" }}
                    >
                      Рекомендуется использовать файлы высокого качества (.jpg,
                      20MB)
                    </div>
                  </div>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <input
                  type="text"
                  placeholder="Введите название ветки"
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
                onClick={onCancel}
              >
                Отмена
              </button>
              <button
                className={`button_secondary Body-3 ${
                  title.trim() ? "button-animate-filter" : ""
                }`}
                onClick={handleSave}
                disabled={isLoading || !title.trim()}
                style={{
                  marginLeft: "16px",
                  backgroundColor: !title.trim() ? "#ECECEC" : undefined,
                  color: !title.trim() ? "#B5B5B5" : undefined,
                }}
              >
                {isLoading
                  ? "Сохранение..."
                  : branchId
                  ? "Обновить"
                  : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
