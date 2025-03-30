import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { ReactComponent as Download } from "../../images/Download.svg";
import { useCreateGuideMutation } from "../../redux/services/guidesAPI";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsInitialized,
} from "../../redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useMediaQuery } from "react-responsive";

export default function CreateGuide() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState(""); // Для хранения названия гайда
  const [text, setText] = useState(""); // Для хранения описания гайда
  const [link, setLink] = useState(""); // Состояние для ссылки
  const isInitialized = useSelector(selectIsInitialized);
  const [fileObject, setFileObject] = useState(null);
  const [loading, setLoading] = useState(false); // Состояние для индикатора загрузки
  const navigate = useNavigate(); // Хук для навигации
  const user = useSelector(selectCurrentUser);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const isImage = file.type.startsWith("image/");
      const isValidExtension = [
        "image/png",
        "image/jpg",
        "image/jpeg",
      ].includes(file.type);
      const isValidSize = isImage && file.size <= 20 * 1024 * 1024;

      if (!isValidExtension) {
        setError(
          "Недопустимый тип файла. Разрешены только изображения (PNG, JPG, JPEG)."
        );
        return;
      }

      if (!isValidSize) {
        setError("Файл превышает допустимый размер");
        return;
      }

      setError("");
      setFile(URL.createObjectURL(file));
      setFileObject(file);
    },
  });
  const handleRemoveFile = () => {
    setFile(null);
  };
  const handleTagChange = (e) => {
    setTags(
      e.target.value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    );
  };

  // Мутация для создания гайда
  const [createGuide] = useCreateGuideMutation();

  const handleSubmit = async () => {
    if (!isInitialized) {
      console.log("Инициализация еще не завершена");
      return;
    }
    setLoading(true);

    try {
      const tagsString = tags.join(", ");
      const guideData = {
        title,
        text,
        link,
        tags: tagsString,
      };

      // Создаем FormData для отправки данных с файлом
      const formData = new FormData();
      formData.append("files", fileObject); // Добавляем файл
      formData.append("title", guideData.title); // Добавляем заголовок
      formData.append("text", guideData.text); // Добавляем текст
      formData.append("link", guideData.link); // Добавляем ссылку
      formData.append("tags", guideData.tags); // Добавляем теги

      // Отправляем запрос на создание гайда
      const response = await createGuide(formData).unwrap();

      console.log("Гайд успешно создан:", response);
      navigate(`/guide/${response.id}`); // Переход к новому гиду
    } catch (err) {
      console.log("Ошибка:", err);
      setError("Ошибка при создании гайда");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="padding"
      style={{ display: "flex", justifyContent: "center" }}
    >
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%", // Занимает всю высоту экрана
            maxWidth: "1120px",
            width: "100%",
            margin: "0 auto",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <div style={{ maxWidth: "1120px", width: "100%", margin: "0 auto" }}>
          {" "}
          <div className="h4" style={{ marginTop: "12px" }}>
            Создание гайда
          </div>
          <div
            style={{
              marginTop: "32px",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {file ? (
                <div
                  style={{
                    position: "relative",
                    border: "2px solid #ccc",
                    borderRadius: "10px",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={file}
                    alt="Uploaded"
                    style={{
                      maxWidth: isMobile ? "90%" : "300px",
                      maxHeight: "300px",
                      borderRadius: "10px",
                    }}
                  />
                  <button
                    onClick={handleRemoveFile}
                    className="button_close Body-3 button-animate-filter"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  style={{
                    backgroundColor: "#E9E9E9",
                    width: isMobile ? "90%" : "300px",
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
                    .jpg (размером меньше 20MB) или mp4 (размером меньше 200MB)
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                marginLeft: !isMobile && "64px",
                width: "100%",
                position: "relative",
              }}
            >
              {!file && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    zIndex: 2,
                    pointerEvents: "none",
                  }}
                ></div>
              )}
              <div style={{ marginTop: isMobile && "24px" }}>
                <div
                  className="Body-3"
                  style={{ fontSize: "14px", userSelect: "none" }}
                >
                  Название
                </div>
                <div
                  className="input_default_border"
                  style={{
                    width: "100%",
                    alignItems: "flex-start",
                    marginTop: "8px",
                  }}
                >
                  <input
                    className="input_default"
                    placeholder="Добавить название"
                    type="text"
                    style={{
                      width: "100%",
                      marginLeft: "20px",
                      marginRight: "20px",
                      textAlign: "left",
                      fontSize: "16px",
                      fontFamily: "Nunito Sans",
                      fontWeight: 400,
                      userSelect: "none",
                    }}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={!file}
                  />
                </div>
              </div>
              <div style={{ marginTop: "16px" }}>
                <div
                  className="Body-3"
                  style={{ fontSize: "14px", userSelect: "none" }}
                >
                  Описание
                </div>
                <div
                  className="input_default_border"
                  style={{
                    width: "100%",
                    alignItems: "flex-start",
                    marginTop: "8px",
                    borderRadius: "15px",
                    overflow: "hidden",
                    height: "100px",
                  }}
                >
                  <textarea
                    className="input_default"
                    placeholder="Добавить подробное описание"
                    style={{
                      paddingTop: "8px",
                      width: "100%",
                      marginLeft: "20px",
                      marginRight: "20px",
                      textAlign: "left",
                      minHeight: "100px",
                      resize: "none",
                      overflow: "hidden",
                      boxSizing: "border-box",
                      height: "auto",
                      fontSize: "16px",
                      fontFamily: "Nunito Sans",
                      fontWeight: 400,
                      userSelect: "none",
                    }}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    disabled={!file}
                  />
                </div>
              </div>
              <div style={{ marginTop: "16px" }}>
                <div
                  className="Body-3"
                  style={{ fontSize: "14px", userSelect: "none" }}
                >
                  Ссылка
                </div>
                <div
                  className="input_default_border"
                  style={{
                    width: "100%",
                    alignItems: "flex-start",
                    marginTop: "8px",
                  }}
                >
                  <input
                    className="input_default"
                    placeholder="Добавить ссылку"
                    type="text"
                    style={{
                      width: "100%",
                      marginLeft: "20px",
                      marginRight: "20px",
                      textAlign: "left",
                      fontSize: "16px",
                      fontFamily: "Nunito Sans",
                      fontWeight: 400,
                    }}
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                    disabled={!file}
                  />
                </div>
              </div>
              <div style={{ marginTop: "16px" }}>
                <div
                  className="Body-3"
                  style={{ fontSize: "14px", userSelect: "none" }}
                >
                  Теги
                </div>
                <div
                  className="input_default_border"
                  style={{
                    width: "100%",
                    alignItems: "flex-start",
                    marginTop: "8px",
                  }}
                >
                  <input
                    className="input_default"
                    placeholder="Добавьте теги (через запятую)"
                    type="text"
                    style={{
                      width: "100%",
                      marginLeft: "20px",
                      marginRight: "20px",
                      textAlign: "left",
                      fontSize: "16px",
                      fontFamily: "Nunito Sans",
                      fontWeight: 400,
                      userSelect: "none",
                    }}
                    onChange={handleTagChange}
                    disabled={!file}
                  />
                </div>
                {tags.length > 0 && (
                  <div
                    style={{
                      marginTop: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    {tags.map((tag, index) => (
                      <span
                        className="Body-3"
                        key={index}
                        style={{
                          backgroundColor: "#E0E0E0",
                          padding: "5px 10px",
                          borderRadius: "20px",
                          fontSize: "14px",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {file && (
                <div style={{ marginTop: "24px" }}>
                  <button
                    className="button Body-3 button-animate-filter"
                    onClick={handleSubmit}
                    disabled={!file}
                  >
                    Опубликовать
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
