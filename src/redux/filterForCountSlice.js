import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  direction: "",
  format: "",
  city: "",
  age: "",
  minPrice: "",
  maxPrice: "",
  district: "", // Добавляем поле для района
  classesPerWeek: "Неважно",
  daysOfWeek: ["Неважно"],
  timeOfDay: "Неважно",
  teacher: "",
  time_zone: "",
  start_time: "",
  end_time: "",
};

const filterForCountSlice = createSlice({
  name: "filterForCount",
  initialState,
  reducers: {
    setDaysOfWeekForCount(state, action) {
      state.daysOfWeek = action.payload;
    },
    setTimeCount(state, action) {
      const { start, end } = action.payload;
      state.start_time = start;
      state.end_time = end;
    },
    setTeacherCount(state, action) {
      state.teacher = action.payload;
    },
    setDistrict(state, action) {
      state.district = action.payload;
    },
    setPriceRangeCount(state, action) {
      const { min, max } = action.payload;
      state.minPrice = min;
      state.maxPrice = max;
    },
    setDirection(state, action) {
      state.direction = action.payload;
    },
    setFormat(state, action) {
      state.format = action.payload;
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
    setAge(state, action) {
      state.age = action.payload;
    },
    setPriceRange(state, action) {
      state.minPrice = action.payload.min;
      state.maxPrice = action.payload.max;
    },
    setClassesPerWeek(state, action) {
      state.classesPerWeek = action.payload;
    },
    setDaysOfWeek(state, action) {
      state.daysOfWeek = action.payload;
    },
    setTimeOfDay(state, action) {
      state.timeOfDay = action.payload;
    },
    setTeacher(state, action) {
      state.teacher = action.payload;
    },
    resetFilterForCountState(state) {
      return initialState;
    },
  },
});

export const {
  setDirection,
  setFormat,
  setCity,
  setAge,
  setPriceRange,
  setClassesPerWeek,
  setDaysOfWeek,
  setDaysOfWeekForCount,
  setTeacherCount,
  setDistrict,
  setTimezone,
  clearimezone,
  setTimeCount,
  setPriceRangeCount,
  setTimeOfDay,
  setTeacher,
  resetFilterForCountState,
} = filterForCountSlice.actions;

export default filterForCountSlice.reducer;
