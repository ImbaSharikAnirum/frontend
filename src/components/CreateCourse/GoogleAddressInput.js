import React from "react";
import { Autocomplete } from "@react-google-maps/api";

const GoogleAddressInput = ({ value, onSelect, required = false }) => {
  const [inputValue, setInputValue] = React.useState(value || "");
  const [autocomplete, setAutocomplete] = React.useState(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setInputValue(value || "");
    // Сбрасываем ошибку при изменении значения
    if (value) {
      setError(false);
    }
  }, [value]);

  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .pac-container {
        border: none !important;
        box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.2) !important;
        border-radius: 12px !important;
        margin-top: 8px !important;
        padding: 12px !important;
        font-family: 'Nunito Sans', sans-serif !important;
      }
      .pac-item {
        padding: 8px 16px !important;
        cursor: pointer !important;
        font-family: 'Nunito Sans', sans-serif !important;
        color: #333 !important;
        font-size: 16px !important;
      }
      .pac-item:hover {
        background-color: #E9E9E9 !important;
        border-radius: 8px !important;
      }
      .pac-icon {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const onLoad = (autoComplete) => {
    setAutocomplete(autoComplete);
  };

  const fixCityName = (cityFromComponent, formattedAddress) => {
    if (cityFromComponent === "Moskva" && formattedAddress.includes("Moscow")) {
      return "Moscow";
    }
    return cityFromComponent;
  };

  const onPlaceChanged = () => {
    if (!autocomplete || !window.google || !window.google.maps) return;

    const place = autocomplete.getPlace();
    console.log("🌐 Получены данные из Autocomplete (RU):", place);

    if (!place.geometry || !place.place_id) {
      console.warn("❌ Недостаточно данных о месте");
      if (required) {
        setError(true);
      }
      return;
    }

    setError(false);

    const addressComponents = place.address_components;
    let streetNumber = "",
      route = "",
      city = "",
      district = "",
      administrativeArea = "",
      country = "",
      postalCode = "";

    for (let component of addressComponents) {
      if (component.types.includes("street_number"))
        streetNumber = component.long_name;
      if (component.types.includes("route")) route = component.long_name;
      if (component.types.includes("locality")) city = component.long_name;
      if (component.types.includes("sublocality"))
        district = component.long_name;
      if (component.types.includes("administrative_area_level_1"))
        administrativeArea = component.long_name;
      if (component.types.includes("country")) country = component.long_name;
      if (component.types.includes("postal_code"))
        postalCode = component.long_name;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    const baseAddress = {
      streetNumber,
      route,
      city,
      district,
      administrativeArea,
      country,
      postalCode,
      name: place.name || "",
      lat,
      lng,
      address: place.formatted_address,
    };

    console.log(
      "📝 Адрес из Autocomplete (formatted):",
      place.formatted_address
    );

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails(
      { placeId: place.place_id, language: "en" },
      (enPlace, status) => {
        if (status === "OK") {
          console.log("✅ Получены данные из PlacesService (EN):", enPlace);

          const enComponents = enPlace.address_components;
          let enRoute = "",
            enCity = "",
            enDistrict = "",
            enAdministrativeArea = "",
            enCountry = "",
            enStreetNumber = "";

          for (let component of enComponents) {
            if (component.types.includes("route"))
              enRoute = component.long_name;
            if (component.types.includes("locality"))
              enCity = component.long_name;
            if (component.types.includes("sublocality"))
              enDistrict = component.long_name;
            if (component.types.includes("administrative_area_level_1"))
              enAdministrativeArea = component.long_name;
            if (component.types.includes("country"))
              enCountry = component.long_name;
            if (component.types.includes("street_number"))
              enStreetNumber = component.long_name;
          }

          const finalCity = fixCityName(enCity, enPlace.formatted_address);

          onSelect({
            ...baseAddress,
            country_en: enCountry,
            city_en: finalCity,
            district_en: enDistrict,
            administrativeArea_en: enAdministrativeArea,
            route_en: enRoute,
            name_en: enPlace.name || "",
            streetNumber_en: enStreetNumber,
            name_original_language: place.name || "",
            country_original_language: country,
            city_original_language: city,
            district_original_language: district,
            administrativeArea_original_language: administrativeArea,
            route_original_language: route,
            streetNumber_original_language: streetNumber,
            original_language: "ru",
            address: place.formatted_address,
            display_address: place.formatted_address,
          });
        } else {
          console.warn("⚠️ Ошибка getDetails:", status);
          onSelect({
            ...baseAddress,
            country_en: "",
            city_en: "",
            district_en: "",
            administrativeArea_en: "",
            route_en: "",
            name_en: "",
            streetNumber_en: "",
            name_original_language: place.name || "",
            country_original_language: country,
            city_original_language: city,
            district_original_language: district,
            administrativeArea_original_language: administrativeArea,
            route_original_language: route,
            streetNumber_original_language: streetNumber,
            original_language: "ru",
            address: place.formatted_address,
          });
        }
      }
    );
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (required && !e.target.value) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div>
      <div
        className="input_default_border"
        style={{
          width: "100%",
          borderColor: error ? "#f44336" : undefined,
          borderWidth: error ? "2px" : undefined,
        }}
      >
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            className="input_default"
            style={{
              width: "500px",
              marginLeft: "20px",
              marginRight: "20px",
              textAlign: "left",
              fontSize: "16px",
              fontFamily: "Nunito Sans",
              fontWeight: 400,
            }}
            value={inputValue}
            onChange={handleInputChange}
            placeholder={required ? "Введите адрес *" : "Введите адрес"}
          />
        </Autocomplete>
      </div>
      {error && (
        <div
          style={{
            color: "#f44336",
            fontSize: "12px",
            marginTop: "4px",
            marginLeft: "20px",
          }}
        >
          Пожалуйста, введите адрес
        </div>
      )}
    </div>
  );
};

export default GoogleAddressInput;
