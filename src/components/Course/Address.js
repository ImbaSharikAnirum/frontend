import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { selectLanguageCode } from "../../redux/reducers/languageReducer";
import { useTranslation } from "react-i18next";
import { ReactComponent as Share2 } from "../../images/share2.svg";
import { Skeleton } from "@mui/material";

export default function Address({ isLoading }) {
  const course = useSelector(selectCurrentCourse);
  const languageCode = useSelector(selectLanguageCode);
  const { t } = useTranslation();

  const getFormattedAddress = () => {
    if (course.format !== "Оффлайн") return t("filters.format.online");

    // Определяем, нужно ли использовать английскую версию
    const shouldUseEnglish =
      languageCode === "en" || course.original_language !== languageCode;

    // Получаем компоненты адреса в зависимости от языка
    const city = shouldUseEnglish
      ? course.city_en
      : course.city_original_language;
    const district = shouldUseEnglish
      ? course.district_en
      : course.district_original_language;
    const street = shouldUseEnglish
      ? course.route_en
      : course.route_original_language;
    const streetNumber = shouldUseEnglish
      ? course.streetNumber_en
      : course.streetNumber_original_language;

    // Формируем адрес
    const addressParts = [];

    if (city) addressParts.push(shouldUseEnglish ? city : `г. ${city}`);
    if (district) addressParts.push(district);
    if (street || streetNumber) {
      const streetAddress = [street, streetNumber].filter(Boolean).join(" ");
      addressParts.push(
        shouldUseEnglish ? streetAddress : `ул. ${streetAddress}`
      );
    }

    return addressParts.join(", ");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      alert(t("errors.sharingNotSupported"));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
        width: "100%",
        height: "60px",
      }}
    >
      {isLoading ? (
        <Skeleton variant="text" width={"70%"} height={"100%"} />
      ) : (
        <div
          className="h5"
          style={{
            display: "flex",
          }}
        >
          {getFormattedAddress()}
        </div>
      )}

      {isLoading ? (
        <Skeleton variant="text" width={"20%"} height={"100%"} />
      ) : (
        <button
          className="button_white button-animate-filter"
          style={{
            display: "flex",
            alignItems: "center",
            borderRadius: "8px",
          }}
          onClick={() => handleShare()}
        >
          <Share2 style={{ fill: "white", width: "16px", height: "16px" }} />
          <div className="h5" style={{ marginLeft: "8px" }}>
            {t("common.share")}
          </div>
        </button>
      )}
    </div>
  );
}
