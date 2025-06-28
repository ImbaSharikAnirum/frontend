import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useJsApiLoader } from "@react-google-maps/api";
import DiscordIcon from "../../images/DiscordIcon";
import { Link } from "react-router-dom";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { useMediaQuery, useTheme, Skeleton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { selectLanguageCode } from "../../redux/reducers/languageReducer";

export default function Location({ isLoading }) {
  const { t } = useTranslation();
  const course = useSelector(selectCurrentCourse);
  const languageCode = useSelector(selectLanguageCode);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = useMemo(
    () =>
      course
        ? {
            lat: parseFloat(course.lat),
            lng: parseFloat(course.lng),
          }
        : null,
    [course]
  );

  const { isLoaded } = useJsApiLoader({
    id: "anirum",
    googleMapsApiKey: "AIzaSyBG3-McnhGanJsLu8AzA2TyXmdA4Ea6sSc",
  });

  const initMap = useCallback(async () => {
    if (!center) return;

    const { Map } = await window.google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
      "marker"
    );

    const mapDiv = document.getElementById("map");
    if (!mapDiv) return;

    const map = new Map(mapDiv, {
      zoom: 15,
      center: center,
      minZoom: 4,
      maxZoom: 20,
      mapId: "YOUR_MAP_ID",
      language: languageCode,
    });

    new AdvancedMarkerElement({
      map: map,
      position: center,
      title: t("course.location"),
    });
  }, [center, t, languageCode]);

  useEffect(() => {
    if (isLoaded) {
      initMap();
    }
  }, [isLoaded, initMap]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  return (
    <div>
      <div
        style={{
          width: "100%",
          borderBottom: "1px solid #CDCDCD",
          marginTop: "32px",
        }}
      ></div>
      {isLoading ? (
        <Skeleton
          variant="text"
          width={isMobile ? "70%" : "30%"}
          height={32}
          style={{
            marginTop: "32px",
            lineHeight: "24px",
          }}
        />
      ) : (
        <div
          className="h4"
          style={{
            marginTop: "32px",
          }}
        >
          {t("course.location")}
        </div>
      )}
      {isLoading ? (
        <div>
          <Skeleton
            variant="text"
            width={isMobile ? "90%" : "60%"}
            height={24}
            style={{
              marginTop: "8px",
              lineHeight: "24px",
            }}
          />
          <Skeleton
            variant="rectangular"
            height={250}
            style={{
              marginTop: "12px",
              lineHeight: "100px",
            }}
          />
        </div>
      ) : (
        <div>
          {course && course.format === "Оффлайн" && (
            <div>
              <div
                className="Body-2"
                style={{
                  display: "flex",
                  marginTop: "8px",
                }}
              >
                {getFormattedAddress()}
              </div>
              <div style={{ marginTop: "16px" }}>
                {isLoaded && center ? (
                  <div id="map" style={containerStyle}></div>
                ) : (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={400}
                    style={{
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {course && course.format === "Онлайн" && (
            <div>
              <div
                className="Body-2"
                style={{
                  marginBottom: "16px",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                {t("course.online")}, Google Meet
                
                {/* {t("course.discord")} */}
              </div>
              {/* <Link
                to={`https://discord.com/`}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#5865F2",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "90px",
                  }}
                >
                  <DiscordIcon />
                </div>
              </Link> */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
