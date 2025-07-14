import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  direction: "", // Направление курса
  format: "", // Формат курса (онлайн/офлайн)
  city: {
    city_en: "",
    city_original_language: "",
  },
  age: "", // Возраст участников
  minPrice: "", // Минимальная цена
  maxPrice: "", // Максимальная цена
  district: {
    district_en: "",
    district_original_language: "",
  },
  classesPerWeek: "Неважно", // Количество занятий в неделю
  daysOfWeek: ["Неважно"], // Дни недели
  timeOfDay: "Неважно", // Время занятий
  teacher: "", // Преподаватель
  time_zone: "",
  start_time: "",
  end_time: "",
  status: "published", // Новый фильтр статуса по умолчанию
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setDirection(state, action) {
      state.direction = action.payload;
    },
    clearDirection(state) {
      state.direction = "";
    },
    setDistrict(state, action) {
      state.district = action.payload;
    },
    setFormat(state, action) {
      state.format = action.payload;
    },
    clearFormat(state) {
      state.format = "";
      state.city = {
        city_en: "",
        city_original_language: "",
      };
      state.district = {
        district_en: "",
        district_original_language: "",
      };
    },
    setTimezone(state, action) {
      state.time_zone = action.payload;
    },
    clearTimezone(state) {
      state.time_zone = "";
    },
    setCity(state, action) {
      state.city = action.payload;
    },
    clearCity(state) {
      state.city = {
        city_en: "",
        city_original_language: "",
      };
    },
    setAge(state, action) {
      state.age = action.payload;
    },
    clearAge(state) {
      state.age = "";
    },
    setTime(state, action) {
      const { start, end } = action.payload;
      state.start_time = start;
      state.end_time = end;
    },
    clearTime(state) {
      state.start_time = "";
      state.end_time = "";
    },
    setPriceRange(state, action) {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },
    clearPriceRange(state) {
      state.minPrice = "";
      state.maxPrice = "";
    },
    setClassesPerWeek(state, action) {
      state.classesPerWeek = action.payload;
    },
    clearClassesPerWeek(state) {
      state.classesPerWeek = "Неважно";
    },
    setDaysOfWeek(state, action) {
      state.daysOfWeek = action.payload;
    },
    clearDaysOfWeek(state) {
      state.daysOfWeek = ["Неважно"];
    },
    setTimeOfDay(state, action) {
      state.timeOfDay = action.payload;
    },
    clearTimeOfDay(state) {
      state.timeOfDay = "Неважно";
    },
    setTeacher(state, action) {
      state.teacher = action.payload;
    },
    clearTeacher(state) {
      state.teacher = "";
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    clearStatus(state) {
      state.status = "published";
    },
    resetFilterState(state) {
      return initialState;
    },
  },
});

export const {
  setDirection,
  clearDirection,
  setFormat,
  clearFormat,
  setCity,
  clearCity,
  setAge,
  clearAge,
  setPriceRange,
  clearPriceRange,
  setTimezone,
  clearTimezone,
  setClassesPerWeek,
  clearClassesPerWeek,
  setDaysOfWeek,
  clearDaysOfWeek,
  setTimeOfDay,
  setTime,
  clearTime,
  clearTimeOfDay,
  setTeacher,
  clearTeacher,
  setDistrict,
  resetFilterState,
  setStatus,
  clearStatus,
} = filterSlice.actions;

export default filterSlice.reducer;
