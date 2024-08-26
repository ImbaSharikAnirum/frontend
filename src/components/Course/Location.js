import React, { useState } from "react";
import { selectCurrentCourse } from "../../redux/reducers/courseReducer";
import { useSelector } from "react-redux";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

export default function Location() {
  const course = useSelector(selectCurrentCourse);

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: -3.745,
    lng: -38.523,
  };
  const { isLoaded } = useJsApiLoader({
    id: "anirum",
    googleMapsApiKey: "AIzaSyBG3-McnhGanJsLu8AzA2TyXmdA4Ea6sSc",
  });

  const [map, setMap] = useState(null);
  //   const center = info.google_maps;

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  const OPTIONS = {
    minZoom: 4,
    maxZoom: 20,
  };

  return (
    <div>
      <div
        className="h4"
        style={{
          marginTop: "12px",
        }}
      >
        Где пройдут занятия
      </div>
      {course.format === "Оффлайн" ? (
        <div
          className="Body-2"
          style={{
            display: "flex",
            marginTop: "8px",
          }}
        >
          г. {course.city}, {course.district}, ул. {course.address}
        </div>
      ) : (
        <div
          className="Body-2"
          style={{
            marginBottom: "16px",
            alignItems: "center",
            marginTop: "8px",
          }}
        >
          {course.format}
        </div>
      )}
      <div style={{ marginTop: "16px" }}>
        {" "}
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            // zoom={18}
            options={OPTIONS}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
