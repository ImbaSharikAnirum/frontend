import React, { useState } from "react";
import {
  GoogleMap as GoogleMapComponent,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "300px",
  marginTop: "16px",
  borderRadius: "8px",
  overflow: "hidden",
};

const defaultCenter = {
  lat: 55.7558,
  lng: 37.6173,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function GoogleMap({ position, onPositionChange }) {
  const [map, setMap] = useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleClick = async (e) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API не загружен");
      return;
    }

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const geocoder = new window.google.maps.Geocoder();

    try {
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results[0]) {
        const addressComponents = response.results[0].address_components;

        let city = "";
        let district = "";

        for (let component of addressComponents) {
          if (component.types.includes("locality")) {
            city = component.long_name;
          }
          if (component.types.includes("sublocality")) {
            district = component.long_name;
          }
        }

        onPositionChange({
          lat,
          lng,
          address: response.results[0].formatted_address,
          city,
          district,
        });
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  return (
    <GoogleMapComponent
      mapContainerStyle={containerStyle}
      center={position || defaultCenter}
      zoom={position ? 15 : 10}
      options={options}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={handleClick}
    >
      {position && <Marker position={position} />}
    </GoogleMapComponent>
  );
}
