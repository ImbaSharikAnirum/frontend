// Страница "Создание курса" с полной формой, стилизованная как на скрине

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Switch, Slider } from "@mui/material";
import { ReactComponent as Download } from "../images/Download.svg";
import { useCreateGroupMutation } from "../redux/services/courseAPI";
import { selectIsInitialized } from "../redux/reducers/authReducer";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DirectionSelect from "../components/CreateCourse/DirectionSelect";
import FormatSelect from "../components/CreateCourse/FormatSelect";
import TeacherSelect from "../components/CreateCourse/TeacherSelect";
import TimezoneSelect from "../components/CreateCourse/TimezoneSelect";
import { LoadScript } from "@react-google-maps/api";
import GoogleAddressInput from "../components/CreateCourse/GoogleAddressInput";
import GoogleMap from "../components/CreateCourse/GoogleMap";
import moment from "moment-timezone";
import {
  selectCurrencySymbol,
  selectCurrency,
  selectCurrencyCode,
} from "../redux/reducers/currencyReducer";
import LanguageCurrencySelector from "../components/LanguageCurrencySelector";
import { selectLanguageCode } from "../redux/reducers/languageReducer";
import LanguageSelect from "../components/CreateCourse/LanguageSelect";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Список основных часовых поясов для стран СНГ и UTC
const MAIN_TIMEZONES = [
  "UTC",
  // Россия
  "Europe/Moscow",
  "Europe/Kaliningrad",
  "Europe/Samara",
  "Asia/Yekaterinburg",
  "Asia/Novosibirsk",
  "Asia/Krasnoyarsk",
  "Asia/Irkutsk",
  "Asia/Yakutsk",
  "Asia/Vladivostok",
  // Другие страны СНГ
  "Asia/Almaty", // Казахстан
  "Europe/Minsk", // Беларусь
  "Europe/Kiev", // Украина
  "Asia/Tashkent", // Узбекистан
  "Asia/Yerevan", // Армения
  "Asia/Baku", // Азербайджан
  "Asia/Tbilisi", // Грузия
];

// Функция для форматирования названия часового пояса
const formatTimezoneName = (zoneName) => {
  const city = zoneName.split("/").pop().replace(/_/g, " ");
  const offset = moment.tz(zoneName).format("Z");
  return `${city} (GMT${offset})`;
};

// Сортировка часовых поясов по смещению UTC
const sortedTimezones = MAIN_TIMEZONES.sort((a, b) => {
  const offsetA = moment.tz(a).utcOffset();
  const offsetB = moment.tz(b).utcOffset();
  return offsetA - offsetB;
});

const ageMarks = [
  { value: 4, label: "4" },
  { value: 18, label: "18+" },
];

export default function CreateCourse() {
  const { t } = useTranslation();
  const currencySymbol = useSelector(selectCurrencySymbol);
  const currencyCode = useSelector(selectCurrencyCode);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [ageStart, setAgeStart] = useState(8);
  const [ageEnd, setAgeEnd] = useState(12);
  const [capacity, setCapacity] = useState(10);
  const [level, setLevel] = useState([]);
  const [inventoryNeeded, setInventoryNeeded] = useState(false);
  const [inventoryItems, setInventoryItems] = useState("");
  const [language, setLanguage] = useState("");
  const [priceLesson, setPriceLesson] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [address, setAddress] = useState("");
  const languageCode = useSelector(selectLanguageCode);
  const [locationData, setLocationData] = useState({
    // Английские версии
    country_en: "",
    city_en: "",
    district_en: "",
    administrativeArea_en: "",
    route_en: "",
    name_en: "",
    streetNumber_en: "",

    // Оригинальные версии
    name_original_language: "",
    country_original_language: "",
    city_original_language: "",
    district_original_language: "",
    administrativeArea_original_language: "",
    route_original_language: "",
    streetNumber_original_language: "",
    original_language: languageCode,

    // Геолокация
    lat: null,
    lng: null,
    address: "",
    display_location_name: "",
  });
  const [direction, setDirection] = useState("");
  const [format, setFormat] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [courseType, setCourseType] = useState("");
  const [software, setSoftware] = useState("");
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isInitialized = useSelector(selectIsInitialized);
  const navigate = useNavigate();
  const [createGroup] = useCreateGroupMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Установка часового пояса по умолчанию при первой загрузке
  useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles;
      const newImages = newFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...newImages]);
      setImageFiles((prev) => [...prev, ...newFiles]);
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxSize: 20 * 1024 * 1024, // 20MB
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
    setImageFiles(items.map((item) => item.file));
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newFiles = [...imageFiles];
    newImages.splice(index, 1);
    newFiles.splice(index, 1);
    setImages(newImages);
    setImageFiles(newFiles);
  };
  console.log("Код валюты:", currencyCode);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Валидация обязательных полей
    if (!direction.trim()) {
      toast.error("Пожалуйста, выберите направление");
      setIsSubmitting(false);
      return;
    }

    if (!description.trim()) {
      toast.error("Пожалуйста, добавьте описание курса");
      setIsSubmitting(false);
      return;
    }

    if (!priceLesson || priceLesson <= 0) {
      toast.error("Пожалуйста, укажите корректную стоимость курса");
      setIsSubmitting(false);
      return;
    }

    if (!selectedTeacher) {
      toast.error("Пожалуйста, выберите преподавателя");
      setIsSubmitting(false);
      return;
    }

    if (!startDay) {
      toast.error("Пожалуйста, укажите дату начала курса");
      setIsSubmitting(false);
      return;
    }

    if (!endDay) {
      toast.error("Пожалуйста, укажите дату окончания курса");
      setIsSubmitting(false);
      return;
    }

    if (!timeZone) {
      toast.error("Пожалуйста, выберите часовой пояс");
      setIsSubmitting(false);
      return;
    }

    if (!ageStart || !ageEnd) {
      toast.error("Пожалуйста, укажите возрастной диапазон");
      setIsSubmitting(false);
      return;
    }

    if (!capacity) {
      toast.error("Пожалуйста, укажите количество учеников");
      setIsSubmitting(false);
      return;
    }

    if (level.length === 0) {
      toast.error("Пожалуйста, выберите уровень сложности");
      setIsSubmitting(false);
      return;
    }

    if (!language) {
      toast.error("Пожалуйста, выберите язык");
      setIsSubmitting(false);
      return;
    }

    if (!startTime || !endTime) {
      toast.error("Пожалуйста, укажите время занятий");
      setIsSubmitting(false);
      return;
    }

    if (!format) {
      toast.error("Пожалуйста, выберите формат курса (онлайн/оффлайн)");
      setIsSubmitting(false);
      return;
    }

    if (!courseType) {
      toast.error("Пожалуйста, выберите тип обучения");
      setIsSubmitting(false);
      return;
    }

    if (imageFiles.length < 5) {
      toast.error("Пожалуйста, загрузите минимум 5 изображений");
      setIsSubmitting(false);
      return;
    }

    // Проверяем, что выбран хотя бы один день недели
    const hasSelectedDays = Object.values(days).some((day) => day);
    if (!hasSelectedDays) {
      toast.error("Пожалуйста, выберите хотя бы один день недели");
      setIsSubmitting(false);
      return;
    }

    // Валидация полей для оффлайн формата
    if (format === "Оффлайн") {
      if (!locationData.lat || !locationData.lng) {
        toast.error("Пожалуйста, укажите адрес для оффлайн курса");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      // Создаем FormData для отправки данных и файлов
      const formData = new FormData();

      // Добавляем все изображения
      imageFiles.forEach((file) => {
        formData.append("files", file);
      });

      // Создаем объект с данными курса
      const courseData = {
        description,
        age_start: parseInt(ageStart),
        age_end: parseInt(ageEnd),
        capacity: parseInt(capacity),
        level: level.join(", "),
        inventory: inventoryNeeded,
        items: inventoryItems,
        language,
        price_lesson: parseInt(priceLesson),
        currency: currencyCode,
        time_zone: timeZone,
        start_time: startTime,
        end_time: endTime,
        start_day: startDay,
        end_day: endDay,
        direction,
        format,
        course_type: courseType,
        teacher: selectedTeacher,
        monday: days.monday,
        tuesday: days.tuesday,
        wednesday: days.wednesday,
        thursday: days.thursday,
        friday: days.friday,
        saturday: days.saturday,
        sunday: days.sunday,
      };

      // Добавляем данные о местоположении для оффлайн-курсов
      if (format === "Оффлайн" && locationData) {
        Object.assign(courseData, {
          country_en: locationData.country_en,
          city_en: locationData.city_en,
          district_en: locationData.district_en,
          administrativeArea_en: locationData.administrativeArea_en,
          route_en: locationData.route_en,
          name_en: locationData.name_en,
          streetNumber_en: locationData.streetNumber_en,
          name_original_language: locationData.name_original_language,
          country_original_language: locationData.country_original_language,
          city_original_language: locationData.city_original_language,
          district_original_language: locationData.district_original_language,
          administrativeArea_original_language:
            locationData.administrativeArea_original_language,
          route_original_language: locationData.route_original_language,
          streetNumber_original_language:
            locationData.streetNumber_original_language,
          original_language: locationData.original_language,
          lat: locationData.lat.toString(),
          lng: locationData.lng.toString(),
          display_location_name: locationData.display_location_name,
        });
      }
      // Добавляем данные курса в FormData
      formData.append("data", JSON.stringify(courseData));

      // Отправляем запрос на создание курса
      const response = await createGroup(formData).unwrap();

      // Перенаправляем на страницу созданного курса
      navigate(`/course/${response.id}`);
    } catch (error) {
      console.error("Ошибка при создании курса:", error);
      toast.error("Ошибка при создании курса. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDayToggle = (day) => {
    setDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleLevelToggle = (selectedLevel) => {
    setLevel((prev) => {
      if (prev.includes(selectedLevel)) {
        return prev.filter((l) => l !== selectedLevel);
      }
      return [...prev, selectedLevel];
    });
  };
  return (
    <div
      className="padding"
      style={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {isSubmitting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <CircularProgress
            size={60}
            style={{
              zIndex: 2000, // поверх всего
            }}
          />
        </div>
      )}
      <div style={{ maxWidth: "1120px", width: "100%", margin: "0 auto" }}>
        <div className="h4" style={{ marginTop: "12px" }}>
          Создание курса
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
              flexDirection: "column",
              alignItems: "flex-start",
              width: isMobile ? "100%" : "300px",
            }}
          >
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
                alignSelf: "center",
              }}
            >
              <input {...getInputProps()} accept="image/*" />
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
                <Download style={{ height: "24px", marginBottom: "12px" }} />
                <div style={{ width: "200px" }} className="Body-2">
                  Выберите файл или перетащите его сюда
                </div>
              </div>
              <div
                className="Body-2"
                style={{ fontSize: "12px", marginTop: "auto" }}
              >
                Рекомендуем использовать файлы высокого качества в формате .jpg
                (размером меньше 20MB)
              </div>
            </div>
          </div>

          <div
            style={{
              marginLeft: !isMobile && "64px",
              width: "100%",
              maxWidth: "680px",
              position: "relative",
            }}
          >
            {images.length > 0 && (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="images" direction="horizontal">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        width: "100%",
                        overflowX: "auto",
                        marginBottom: "24px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "24px",
                          padding: "12px 14px",
                          minWidth: "min-content",
                        }}
                      >
                        {images.map((image, index) => (
                          <Draggable
                            key={image.id}
                            draggableId={image.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  position: "relative",
                                  width: "120px",
                                  height: "120px",
                                  flexShrink: 0,
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <div
                                  style={{
                                    position: "absolute",
                                    top: -10,
                                    left: -10,
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    backgroundColor: "#4B4B4B",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    zIndex: 2,
                                  }}
                                >
                                  {index + 1}
                                </div>
                                <div
                                  style={{
                                    position: "relative",
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    backgroundColor: "#fff",
                                    border: "1px solid #E0E0E0",
                                  }}
                                >
                                  <img
                                    src={image.preview}
                                    alt={`preview-${index}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                  }}
                                  style={{
                                    position: "absolute",
                                    top: -10,
                                    right: -10,
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    border: "none",
                                    background: "white",
                                    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 0,
                                    fontSize: "16px",
                                    zIndex: 2,
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
            <div style={{ marginTop: isMobile && "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", userSelect: "none" }}
              >
                Настройки
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexDirection: isMobile ? "column" : "row",
                  marginTop: "8px",
                }}
              >
                <DirectionSelect
                  onSelect={setDirection}
                  selectedDirection={direction}
                />
                <FormatSelect onSelect={setFormat} selectedFormat={format} />
                <TeacherSelect
                  onSelect={setSelectedTeacher}
                  selectedTeacher={selectedTeacher}
                />
              </div>
            </div>
            <div
              style={{
                marginTop: "16px",
                display: direction === "Формат" ? "block" : "none",
              }}
            >
              <div
                className="Body-3"
                style={{ fontSize: "14px", userSelect: "none" }}
              >
                Формат
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
                  placeholder="Выберите формат"
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
                />
              </div>
            </div>{" "}
            <LoadScript
              googleMapsApiKey="AIzaSyBG3-McnhGanJsLu8AzA2TyXmdA4Ea6sSc"
              libraries={["places"]}
              language={languageCode}
              onError={(error) => {
                console.error("Ошибка загрузки Google Maps API:", error);
              }}
            >
              <div style={{ marginTop: "16px" }}>
                {format === "Оффлайн" && (
                  <div style={{ marginTop: "16px" }}>
                    <div className="Body-3" style={{ fontSize: "14px" }}>
                      Адрес
                    </div>
                    <GoogleAddressInput
                      value={locationData.address}
                      onSelect={(data) => {
                        console.log("Данные из GoogleAddressInput:", data);
                        setLocationData({
                          // Английские версии
                          country_en: data.country_en,
                          city_en: data.city_en,
                          district_en: data.district_en,
                          administrativeArea_en: data.administrativeArea_en,
                          route_en: data.route_en,
                          name_en: data.name_en,
                          streetNumber_en: data.streetNumber_en,

                          // Оригинальные версии
                          name_original_language: data.name_original_language,
                          country_original_language:
                            data.country_original_language,
                          city_original_language: data.city_original_language,
                          district_original_language:
                            data.district_original_language,
                          administrativeArea_original_language:
                            data.administrativeArea_original_language,
                          route_original_language: data.route_original_language,
                          streetNumber_original_language:
                            data.streetNumber_original_language,
                          original_language: data.original_language,

                          // Геолокация
                          lat: data.lat,
                          lng: data.lng,
                          address: data.address,
                          display_location_name:
                            locationData.display_location_name,
                        });
                      }}
                      required={format === "Оффлайн"}
                    />
                    <div
                      className="input_default_border"
                      style={{
                        width: "100%",
                        marginTop: "16px",
                      }}
                    >
                      <input
                        className="input_default"
                        placeholder="Простое название: метро, район, ТЦ..."
                        value={locationData.display_location_name}
                        onChange={(e) =>
                          setLocationData((prev) => ({
                            ...prev,
                            display_location_name: e.target.value,
                          }))
                        }
                        style={{
                          width: "100%",
                          marginLeft: "20px",
                          marginRight: "20px",
                          textAlign: "left",
                          fontSize: "16px",
                          fontFamily: "Nunito Sans",
                          fontWeight: 400,
                        }}
                      />
                    </div>
                    <GoogleMap
                      position={
                        locationData.lat && locationData.lng
                          ? { lat: locationData.lat, lng: locationData.lng }
                          : null
                      }
                      onPositionChange={(data) => {
                        setLocationData({
                          lat: data.lat,
                          lng: data.lng,
                          country: "Россия",
                          city: data.city,
                          district: data.district || "",
                          administrativeArea: data.administrativeArea,
                          postalCode: data.address.split(", ").pop() || "",
                          name: data.name || "",
                          route: data.route || "",
                          streetNumber: data.streetNumber || "",
                        });
                      }}
                    />
                  </div>
                )}
              </div>
            </LoadScript>
            <div style={{ marginTop: "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", marginBottom: "8px" }}
              >
                Возрастной диапазон
              </div>
              <Slider
                value={[ageStart, ageStart >= 18 ? ageStart : ageEnd]}
                onChange={(e, newValue) => {
                  const newStart = newValue[0];
                  setAgeStart(newStart);
                  if (newStart >= 18) {
                    setAgeEnd(newStart);
                  } else if (newStart === 4) {
                    setAgeStart(8);
                    setAgeEnd(12);
                  } else {
                    setAgeEnd(newValue[1]);
                  }
                }}
                valueLabelDisplay="off"
                min={4}
                max={18}
                step={1}
                disabled={ageStart >= 18}
                aria-labelledby="age-range-slider"
                sx={{
                  width: "100%",
                  "& .MuiSlider-track": {
                    backgroundColor: "black",
                    height: "2px",
                  },
                  "& .MuiSlider-rail": {
                    backgroundColor: "#BDBDBD",
                    height: "4px",
                  },
                  "& .MuiSlider-thumb": {
                    color: "black !important",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #CDCDCD",
                    width: "24px",
                    height: "24px",
                    "&:hover": {
                      boxShadow: "none",
                    },
                    "&:focus, &:focus-visible": {
                      outline: "none",
                      boxShadow: "none",
                    },
                    "&:active": {
                      boxShadow: "none",
                    },
                  },
                  "& .MuiSlider-root": {
                    "&:focus, &:focus-visible": {
                      outline: "none",
                      boxShadow: "none",
                      color: "inherit",
                    },
                  },
                  "& .MuiSlider-valueLabel": {
                    display: "none",
                  },
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <div
                  className="Body-2 input_filter_price_min"
                  style={{ fontSize: "14px", height: "50px" }}
                >
                  <div style={{ fontSize: 12, color: "#757575" }}>
                    {ageStart >= 18 ? "Возраст" : "Минимальный возраст"}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <input
                      type="number"
                      value={ageStart}
                      onChange={(e) => {
                        const value = Math.min(
                          Math.max(parseInt(e.target.value) || 4, 4),
                          18
                        );
                        setAgeStart(value);
                        if (value >= 18) {
                          setAgeEnd(value);
                        }
                      }}
                      min={4}
                      max={18}
                      style={{
                        fontSize: 14,
                        color: "black",
                        border: "none",
                        outline: "none",
                        width: isMobile ? "40px" : "60px",
                      }}
                    />
                    {ageStart >= 18 && (
                      <span style={{ fontSize: 14, color: "#757575" }}>+</span>
                    )}
                  </div>
                </div>
                {ageStart < 18 && (
                  <>
                    <div
                      style={{
                        width: "40px",
                        height: "1.5px",
                        backgroundColor: "#CDCDCD",
                        margin: "0 10px",
                      }}
                    />
                    <div
                      className="Body-2 input_filter_price_min"
                      style={{ fontSize: "14px", height: "50px" }}
                    >
                      <div style={{ fontSize: 12, color: "#757575" }}>
                        Максимальный возраст
                      </div>
                      <input
                        type="number"
                        value={ageEnd}
                        onChange={(e) => {
                          const value = Math.max(
                            Math.min(parseInt(e.target.value) || 18, 18),
                            ageStart
                          );
                          setAgeEnd(value);
                        }}
                        min={4}
                        max={18}
                        style={{
                          fontSize: 14,
                          color: "black",
                          border: "none",
                          outline: "none",
                          width: isMobile ? "40px" : "60px",
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Switch
                  checked={ageStart >= 18}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAgeStart(18);
                      setAgeEnd(18);
                    } else {
                      setAgeStart(8);
                      setAgeEnd(12);
                    }
                  }}
                  size="small"
                />
                <span
                  className="Body-3"
                  style={{ fontSize: "14px", color: "#757575" }}
                >
                  Только для взрослых (18+)
                </span>
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", marginBottom: "8px" }}
              >
                Количество учеников в группе
              </div>
              <div
                className="button-group"
                style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCapacity(num)}
                    className={`button-animate number-button ${
                      capacity === num ? "selected" : ""
                    }`}
                    style={{
                      width: "40px",
                      height: "40px",
                      padding: 0,
                      borderRadius: "50%",
                      border: "1px solid #DDDDDD",
                      backgroundColor: capacity === num ? "black" : "white",
                      color: capacity === num ? "white" : "black",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", marginBottom: "8px" }}
              >
                Уровень сложности
              </div>
              <div
                className="button-group"
                style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
              >
                {[
                  { id: "beginner", label: "С нуля" },
                  { id: "experienced", label: "Опытным" },
                  { id: "professional", label: "Профессионалам" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleLevelToggle(type.label)}
                    className={`button-animate ${
                      level.includes(type.label) ? "selected" : ""
                    }`}
                    style={{
                      padding: "10px 20px",
                      border: "1px solid #DDDDDD",
                      backgroundColor: level.includes(type.label)
                        ? "black"
                        : "white",
                      color: level.includes(type.label) ? "white" : "black",
                      borderRadius: "25px",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", marginBottom: "8px" }}
              >
                Тип обучения
              </div>
              <div
                className="button-group"
                style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
              >
                {[
                  { id: "circle", label: "Кружок" },
                  { id: "courses", label: "Курсы" },
                  { id: "intensive", label: "Интенсив" },
                  { id: "individual", label: "Индивидуальные" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setCourseType(type.label)}
                    className={`button-animate ${
                      courseType === type.label ? "selected" : ""
                    }`}
                    style={{
                      padding: "10px 20px",
                      border: "1px solid #DDDDDD",
                      backgroundColor:
                        courseType === type.label ? "black" : "white",
                      color: courseType === type.label ? "white" : "black",
                      borderRadius: "25px",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", marginBottom: "8px" }}
              >
                Дни недели
              </div>
              <div
                className="button-group"
                style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
              >
                {[
                  { id: "monday", label: "Понедельник" },
                  { id: "tuesday", label: "Вторник" },
                  { id: "wednesday", label: "Среда" },
                  { id: "thursday", label: "Четверг" },
                  { id: "friday", label: "Пятница" },
                  { id: "saturday", label: "Суббота" },
                  { id: "sunday", label: "Воскресенье" },
                ].map((day) => (
                  <button
                    key={day.id}
                    onClick={() => handleDayToggle(day.id)}
                    className={`button-animate ${
                      days[day.id] ? "selected" : ""
                    }`}
                    style={{
                      padding: "10px 20px",
                      border: "1px solid #DDDDDD",
                      backgroundColor: days[day.id] ? "black" : "white",
                      color: days[day.id] ? "white" : "black",
                      borderRadius: "25px",
                      fontSize: "14px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      minWidth: "120px",
                      textAlign: "center",
                    }}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", marginBottom: "8px" }}
              >
                Даты
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <input
                  type="date"
                  value={startDay}
                  onChange={(e) => setStartDay(e.target.value)}
                  className="input_default_border"
                  style={{
                    width: isMobile ? "140px" : "160px",
                    height: "44px",
                    padding: "0 12px",
                    fontSize: "16px",
                  }}
                />
                <input
                  type="date"
                  value={endDay}
                  onChange={(e) => setEndDay(e.target.value)}
                  className="input_default_border"
                  style={{
                    width: isMobile ? "140px" : "160px",
                    height: "44px",
                    padding: "0 12px",
                    fontSize: "16px",
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", marginBottom: "8px" }}
              >
                Время занятий
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                }}
              >
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input_default_border"
                  style={{
                    width: isMobile ? "140px" : "120px",
                    height: "44px",
                    padding: "0 12px",
                    fontSize: "16px",
                  }}
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input_default_border"
                  style={{
                    width: isMobile ? "140px" : "120px",
                    height: "44px",
                    padding: "0 12px",
                    fontSize: "16px",
                  }}
                />
                <TimezoneSelect value={timeZone} onSelect={setTimeZone} />
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", marginBottom: "8px" }}
              >
                Инвентарь
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Switch
                  checked={inventoryNeeded}
                  onChange={() => setInventoryNeeded(!inventoryNeeded)}
                />
                <span className="Body-3">
                  {inventoryNeeded
                    ? "Если клиентам нужен инвентарь, поставить галочку"
                    : "Инвентарь не требуется"}
                </span>
              </div>
              {inventoryNeeded && (
                <div
                  className="input_default_border"
                  style={{
                    width: "100%",
                    marginTop: "8px",
                  }}
                >
                  <input
                    className="input_default"
                    placeholder="Перечислите инвентарь"
                    value={inventoryItems}
                    onChange={(e) => setInventoryItems(e.target.value)}
                    style={{
                      width: "100%",
                      marginLeft: "20px",
                      marginRight: "20px",
                      fontSize: "16px",
                    }}
                  />
                </div>
              )}
            </div>
            <div style={{ marginTop: "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", marginBottom: "8px" }}
              >
                Прочее
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <LanguageSelect
                  onSelect={setLanguage}
                  selectedLanguage={language}
                />
                <div
                  className="input_default_border"
                  style={{
                    width: isMobile ? "100%" : "280px",
                    height: "44px",
                  }}
                >
                  <input
                    className="input_default Body-2"
                    placeholder="Софт"
                    value={software}
                    onChange={(e) => setSoftware(e.target.value)}
                    style={{
                      width: "100%",
                      height: "100%",
                      padding: "0 20px",
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      color: software ? "#333" : "#999",
                      textAlign: "left",
                      fontSize: "16px",
                    }}
                  />
                </div>
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div
                className="input_default_border"
                style={{
                  width: isMobile ? "100%" : "100%",
                  minHeight: "120px",
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "12px 0",
                  borderRadius: "20px",
                }}
              >
                <textarea
                  className="input_default Body-2"
                  placeholder="Описание"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    marginLeft: "20px",
                    marginRight: "20px",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: description ? "#333" : "#999",
                    resize: "none",
                    minHeight: "96px",
                    lineHeight: "1.5",
                    textAlign: "left",
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: "24px" }}>
              <div
                className="Body-3"
                style={{ fontSize: "14px", marginBottom: "8px" }}
              >
                Цена занятия
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <div
                  className="input_default_border"
                  style={{
                    width: isMobile ? "100%" : "160px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <input
                    type="number"
                    value={priceLesson}
                    onChange={(e) => setPriceLesson(e.target.value)}
                    className="input_default"
                    placeholder="0"
                    style={{
                      width: "100px",
                      marginLeft: "20px",
                      fontSize: "16px",
                      textAlign: "left",
                      color: "#000000",
                    }}
                  />
                  <span
                    style={{
                      marginRight: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() => setCurrencyDialogOpen(true)}
                  >
                    {currencySymbol}
                  </span>
                </div>
              </div>
            </div>
            <LanguageCurrencySelector
              open={currencyDialogOpen}
              onClose={() => setCurrencyDialogOpen(false)}
              defaultTab={1}
            />
            <div style={{ marginTop: "32px", marginBottom: "32px" }}>
              <button
                className="button Body-3 button-animate-filter"
                onClick={handleSubmit}
                style={{
                  width: "160px",
                }}
              >
                Опубликовать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
