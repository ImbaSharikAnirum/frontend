import React, { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { hideFooterMenu, showFooterMenu } from "../../redux/footerMenuSlice";
import Checkbox from "@mui/material/Checkbox";
import { useCreateComplainMutation } from "../../redux/services/guidesAPI";

export default function GuideComplainModal({ onClose, guideId }) {
  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedComplaints, setSelectedComplaints] = useState({});

  // Список причин жалобы с переформулированными пунктами
  const complaintOptions = [
    {
      id: "unwanted",
      title: "Нежелательные публикации",
      description: "Спам, вводящие в заблуждение или повторяющиеся сообщения",
    },
    {
      id: "sexual",
      title: "Сексуально откровенный контент",
      description:
        "Материалы сексуального характера, включая порнографию, обнажённые изображения и контент с участием несовершеннолетних или с явными злоупотреблениями",
    },
    {
      id: "selfharm",
      title: "Пропаганда саморазрушения",
      description:
        "Публикации, поощряющие само-вред, расстройства пищевого поведения или суицидальные настроения",
    },
    {
      id: "misinfo",
      title: "Дезинформация",
      description:
        "Неверные сведения о здоровье, климате, выборах или теории заговора",
    },
    {
      id: "aggressive",
      title: "Агрессивное поведение",
      description:
        "Высказывания с предрассудками, стереотипами, идеями превосходства или оскорблениями",
    },
    {
      id: "dangerous",
      title: "Небезопасные товары",
      description:
        "Публикации, связанные с наркотиками, оружием или иными регулируемыми товарами",
    },
    {
      id: "harassment",
      title: "Преследование и оскорбления",
      description:
        "Угрозы, кибербуллинг или публикация обнажённых изображений без разрешения",
    },
    {
      id: "violence",
      title: "Экспозиция насилия",
      description: "Графические изображения или пропаганда насилия",
    },
    {
      id: "privacy",
      title: "Нарушение конфиденциальности",
      description:
        "Публикация личных фотографий или раскрытие персональной информации",
    },
    {
      id: "copyright",
      title: "Защита интеллектуальной собственности",
      description: "Материалы, нарушающие авторские права или товарные знаки",
    },
  ];

  const handleCheckboxChange = (id) => {
    setSelectedComplaints((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    dispatch(hideFooterMenu());
    return () => {
      dispatch(showFooterMenu());
    };
  }, [dispatch]);

  // Закрытие модалки при клике вне её области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
        dispatch(showFooterMenu());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, dispatch]);
  const [createComplain] = useCreateComplainMutation();

  // Обработчик отправки жалобы
  const handleSubmit = async () => {
    setIsLoading(true);
    // Получаем список выбранных причин
    const selected = Object.keys(selectedComplaints).filter(
      (key) => selectedComplaints[key]
    );
    // Формируем строку с названиями выбранных причин
    const selectedTitles = complaintOptions
      .filter((option) => selectedComplaints[option.id])
      .map((option) => option.title)
      .join(", ");
    try {
      // Здесь можно добавить логику отправки жалобы, включая selected и текст комментария
      await createComplain({ title: selectedTitles, guideId }).unwrap();
      console.log("Выбранные причины жалобы:", selected);
      toast.success("Жалоба успешно отправлена");
      onClose();
      dispatch(showFooterMenu());
    } catch (error) {
      toast.error("Ошибка при отправке жалобы");
      console.error("Ошибка при отправке жалобы:", error);
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
                onClick={() => {
                  onClose();
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
              <div className="h5">Пожаловаться</div>
            </div>
            {/* Обёртка для скроллируемого контента */}
            <div
              style={{
                padding: "16px",
                overflowY: "auto",
                maxHeight: isMobile ? "80vh" : "550px",
              }}
            >
              {complaintOptions.map((option) => (
                <div
                  key={option.id}
                  style={{
                    display: "flex",
                    marginBottom: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <Checkbox
                      checked={selectedComplaints[option.id] || false}
                      onChange={() => handleCheckboxChange(option.id)}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "8px",
                      marginTop: "8px",
                    }}
                  >
                    <div className="Body-2">{option.title}</div>
                    <div
                      className="Body-2"
                      style={{
                        fontSize: "0.9em",
                        color: "#666",
                        marginTop: "4px",
                      }}
                    >
                      {option.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="modal-buttons"
            style={{ alignItems: "flex-end", justifyContent: "right" }}
          >
            <button
              className="button_secondary Body-3 button-animate-filter"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Отправка..." : "Отправить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
