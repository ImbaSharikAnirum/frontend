import React, { useEffect, useCallback, useMemo } from "react"; // Импортируем useMemo
import { useSelector } from "react-redux";
import { useJsApiLoader } from "@react-google-maps/api";
import DiscordIcon from "../../images/DiscordIcon";
import { Link } from "react-router-dom";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { useMediaQuery, useTheme, Skeleton } from "@mui/material";

export default function Location({ isLoading }) {
  const course = useSelector(selectCurrentCourse);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = useMemo(
    () =>
      course && course.location
        ? {
            lat: parseFloat(course.location.lat),
            lng: parseFloat(course.location.lng),
          }
        : null,
    [course] // Зависимость от course
  );
  const { isLoaded } = useJsApiLoader({
    id: "anirum",
    googleMapsApiKey: "AIzaSyBG3-McnhGanJsLu8AzA2TyXmdA4Ea6sSc",
  });

  // Используем useCallback для инициализации карты
  const initMap = useCallback(async () => {
    if (!center) return; // Проверяем наличие центра

    const { Map } = await window.google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
      "marker"
    );

    const mapDiv = document.getElementById("map");
    if (!mapDiv) {
      return; // Прекращаем выполнение, если элемент не найден
    }

    const map = new Map(mapDiv, {
      zoom: 15,
      center: center,
      minZoom: 4,
      maxZoom: 20,
      mapId: "YOUR_MAP_ID",
    });

    // Создание маркера
    new AdvancedMarkerElement({
      map: map,
      position: center,
      title: "Место проведения занятий",
    });
  }, [center]); // Добавляем center в зависимости

  useEffect(() => {
    if (isLoaded) {
      initMap();
    }
  }, [isLoaded, initMap]); // Добавляем initMap в зависимости
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
          Где пройдут занятия
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
            // width={isMobile ? "90%" : "60%"}
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
                г. {course.city}, {course.district}, ул. {course.address}
              </div>
              <div style={{ marginTop: "16px" }}>
                {isLoaded && center ? (
                  <div id="map" style={containerStyle}></div>
                ) : (
                  <div>Loading map...</div>
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
                {course.format}, приложение Discord
              </div>
              <Link
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
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
