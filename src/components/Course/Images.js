import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  selectCourseStatus,
  selectCurrentCourse,
} from "../../redux/reducers/courseReducer";
import { ReactComponent as Left } from "../../images/left.svg";
import { ReactComponent as Right } from "../../images/right.svg";
import { ReactComponent as Share2 } from "../../images/share2.svg";
import { useMediaQuery, useTheme, Modal, Skeleton } from "@mui/material";
import { useSwipeable } from "react-swipeable";
import "../../styles/slider.css";

export default function Images({ isLoading }) {
  const course = useSelector(selectCurrentCourse);
  const status = useSelector(selectCourseStatus);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const prev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? course.images.length - 1 : prevIndex - 1
    );
  };

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === course.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    touchEventOptions: { passive: true },
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };
  return (
    <div style={{ width: "100%", height: isMobile ? "" : "500px" }}>
      <Modal
        open={open}
        onClose={handleClose}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          {/* Кнопка закрытия "X" */}
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ color: "white", fontSize: "24px" }}>✕</span>
          </button>

          <button
            onClick={prev}
            style={{
              position: "absolute",
              left: "10px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Left style={{ fill: "white", width: "40px", height: "40px" }} />
          </button>

          <img
            src={course.images[currentIndex]?.original} // Оригинальное изображение
            srcSet={`
                ${course.images[currentIndex]?.small} 480w,
                ${course.images[currentIndex]?.medium} 768w,
                ${course.images[currentIndex]?.large} 1200w
            `}
            style={{ maxHeight: "80%", maxWidth: "80%" }}
            alt="Курс"
            onError={(e) => {
              e.target.onerror = null; // предотвратить бесконечный цикл
              e.target.src = "path/to/placeholder/image.png"; // путь к запасному изображению
            }}
          />
          <button
            onClick={next}
            style={{
              position: "absolute",
              right: "10px",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Right style={{ fill: "white", width: "40px", height: "40px" }} />
          </button>

          <div
            style={{
              position: "absolute",
              bottom: "20px",
              color: "white",
              fontSize: "18px",
            }}
          >
            {`${currentIndex + 1} / ${course.images.length}`}
          </div>
        </div>
      </Modal>
      {isMobile && <div style={{ height: "390px", top: 0 }}></div>}
      {!isMobile ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div
            style={{
              width: "50%",
              paddingRight: "10px",
              height: "100%",
            }}
          >
            {isLoading || status === "idle" ? (
              <Skeleton
                style={{
                  borderRadius: "16px",
                  transform: "none",
                }}
                width={"100%"}
                height={"100%"}
              />
            ) : (
              <img
                srcSet={`
                ${course.images[0]?.small} 480w,
                ${course.images[0]?.medium} 768w,
                ${course.images[0]?.large} 1200w
              `}
                sizes="(max-width: 600px) 480px, (max-width: 1024px) 768px, 1200px"
                src={`${course.images[0].original}`}
                alt="Курс"
                className="slide-image"
                style={{
                  boxShadow:
                    "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0",
                  border: "none",
                  borderRadius: "16px",
                }}
              />
            )}
          </div>
          <div
            style={{
              width: "50%",
              paddingLeft: "10px",
            }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                height: "50%",
              }}
            >
              <div
                style={{
                  width: "50%",
                  paddingRight: "20px",
                  paddingBottom: "10px",
                }}
              >
                {isLoading || status === "idle" ? (
                  <Skeleton
                    style={{
                      borderRadius: "16px",
                      transform: "none",
                    }}
                    width={"100%"}
                    height={"100%"}
                  />
                ) : (
                  <img
                    srcSet={`
                    ${course.images[1]?.small} 480w,
                    ${course.images[1]?.medium} 768w,
                    ${course.images[1]?.large} 1200w
                  `}
                    sizes="(max-width: 600px) 480px, (max-width: 1024px) 768px, 1200px"
                    src={`${course.images[1].original}`}
                    alt="Курс"
                    className="slide-image"
                    style={{
                      boxShadow:
                        "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0",
                      border: "none",
                      borderRadius: "16px",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  width: "50%",
                  paddingBottom: "10px",
                }}
              >
                {isLoading || status === "idle" ? (
                  <Skeleton
                    style={{
                      borderRadius: "16px",
                      transform: "none",
                    }}
                    width={"100%"}
                    height={"100%"}
                  />
                ) : (
                  <img
                    srcSet={`
                    ${course.images[2]?.small} 480w,
                    ${course.images[2]?.medium} 768w,
                    ${course.images[2]?.large} 1200w
                  `}
                    sizes="(max-width: 600px) 480px, (max-width: 1024px) 768px, 1200px"
                    src={`${course.images[2].original}`}
                    alt="Курс"
                    className="slide-image"
                    style={{
                      boxShadow:
                        "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0",
                      border: "none",
                      borderRadius: "16px",
                    }}
                  />
                )}
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                height: "50%",
              }}
            >
              <div
                style={{
                  width: "50%",
                  paddingRight: "20px",
                  paddingTop: "10px",
                }}
              >
                {isLoading || status === "idle" ? (
                  <Skeleton
                    style={{
                      borderRadius: "16px",
                      transform: "none",
                    }}
                    width={"100%"}
                    height={"100%"}
                  />
                ) : (
                  <img
                    src={`${course.images[3].original}`}
                    srcSet={`
                    ${course.images[3]?.small} 480w,
                    ${course.images[3]?.medium} 768w,
                    ${course.images[3]?.large} 1200w
                  `}
                    sizes="(max-width: 600px) 480px, (max-width: 1024px) 768px, 1200px"
                    alt="Курс"
                    className="slide-image"
                    style={{
                      boxShadow:
                        "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0",
                      borderRadius: "16px",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  position: "relative",
                  width: "50%",
                  paddingTop: "10px",
                }}
              >
                {isLoading || status === "idle" ? (
                  <Skeleton
                    style={{
                      borderRadius: "16px",
                      transform: "none",
                    }}
                    width={"100%"}
                    height={"100%"}
                  />
                ) : (
                  <img
                    srcSet={`
                    ${course.images[4]?.small} 480w,
                    ${course.images[4]?.medium} 768w,
                    ${course.images[4]?.large} 1200w
                  `}
                    sizes="(max-width: 600px) 480px, (max-width: 1024px) 768px, 1200px"
                    src={`${course.images[4].original}`}
                    alt="Курс"
                    className="slide-image"
                    style={{
                      boxShadow:
                        "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0",
                      borderRadius: "16px",
                    }}
                  />
                )}
                {(!isLoading || status === "succeeded") && (
                  <button
                    onClick={handleOpen}
                    style={{
                      position: "absolute", // Позиционирование кнопки относительно родительского контейнера
                      right: "10px", // Отступ справа
                      bottom: "10px", // Отступ снизу
                      backgroundColor: "white", // Фон кнопки
                      padding: "5px 10px", // Внутренние отступы кнопки
                      borderRadius: "8px", // Радиус границы кнопки
                      border: "1px solid #DDDDDD", // Граница кнопки
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#F0F0F0")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "white")
                    }
                    onMouseDown={(e) =>
                      (e.target.style.transform = "scale(0.95)")
                    }
                    onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                  >
                    Смотреть все
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="image-container"
          {...handlers}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "400px",
            border: "none",
            borderRadius: "0px",
          }}
        >
          {(!isLoading || status === "succeeded") && (
            <button
              onClick={() => window.history.back()}
              className="button_only_icon"
              style={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                top: "24px",
                left: "24px",
                height: "36px",
                width: "36px",
                // backgroundColor: "transparent",
                boxShadow:
                  "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0",
                border: "none",
                cursor: "pointer",
                zIndex: 1000, // Убедитесь, что кнопка находится поверх других элементов
              }}
            >
              <Left style={{ fill: "white", width: "40px", height: "40px" }} />
            </button>
          )}
          {(!isLoading || status === "succeeded") && (
            <button
              onClick={() => handleShare()}
              className="button_only_icon"
              style={{
                position: "absolute",
                display: "flex",
                alignItems: "center",
                top: "24px",
                right: "24px",
                height: "36px",
                width: "36px",
                boxShadow:
                  "0 0 0 1px transparent, 0 0 0 4px transparent, 0 0 0 0.5px #E0E0E0", // Пример имитации границы
                // backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 1000, // Убедитесь, что кнопка находится поверх других элементов
              }}
            >
              <Share2
                style={{ fill: "white", width: "40px", height: "40px" }}
              />
            </button>
          )}
          {isLoading || !status === "succeeded" ? (
            <Skeleton
              style={{
                transform: "none",
              }}
              width={"100%"}
              height={"100%"}
            />
          ) : (
            course.images.map((image, index) => (
              <div
                key={index}
                className="slide-image-container"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  transition: "transform 0.5s ease",
                }}
              >
                <img
                  src={image.original} // Оригинальное изображение
                  srcSet={`
                      ${image.small} 480w,
                      ${image.medium} 768w,
                      ${image.large} 1200w
                  `}
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                  alt="Курс"
                  className="slide-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.png"; // Запасное изображение
                  }}
                />
              </div>
            ))
          )}
          {(!isLoading || status === "succeeded") && (
            <div
              className="Body-2"
              style={{
                position: "absolute",
                bottom: "10px",
                right: "0px",
                transform: "translateX(-30%)",
                color: "white",
                fontSize: "14px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "5px 10px",
                borderRadius: "4px",
              }}
            >
              {`${currentIndex + 1} / ${course.images.length}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
