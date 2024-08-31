import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import DiscordIcon from "../../images/DiscordIcon";
import { Link } from "react-router-dom";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";

export default function Location() {
  const course = useSelector(selectCurrentCourse);
  const [mapLoaded, setMapLoaded] = useState(false);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };
  // Проверяем, есть ли данные для координат
  const center =
    course && course.location
      ? {
          lat: parseFloat(course.location.lat),
          lng: parseFloat(course.location.lng),
        }
      : null;

  // Загружаем API Google Maps
  const { isLoaded } = useJsApiLoader({
    id: "anirum",
    googleMapsApiKey: "AIzaSyBG3-McnhGanJsLu8AzA2TyXmdA4Ea6sSc",
  });

  const onLoad = React.useCallback(
    function callback(map) {
      if (center) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMapLoaded(true);
      }
    },
    [center]
  );

  const onUnmount = React.useCallback(function callback(map) {
    setMapLoaded(false);
  }, []);

  const OPTIONS = {
    minZoom: 4,
    maxZoom: 20,
    zoom: 11, // Добавьте этот параметр для установки начального уровня масштаба
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
      <div
        className="h4"
        style={{
          marginTop: "32px",
        }}
      >
        Где пройдут занятия
      </div>
      {course && course.format === "Оффлайн" ? (
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
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                options={OPTIONS}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                <Marker position={center} />
              </GoogleMap>
            ) : (
              <div>Loading map...</div>
            )}
          </div>
        </div>
      ) : (
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
  );
}
