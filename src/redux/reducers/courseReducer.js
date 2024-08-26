import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

// Начальное состояние для курса
const initialState = {
  course: null,
  status: "idle",
  error: null,
};

// Создание среза (slice)
const courseReducer = createSlice({
  name: "course",
  initialState,
  reducers: {
    setCourse: (state, action) => {
      state.course = action.payload;
      state.status = "succeeded";
    },
    resetCourse: (state) => {
      state.course = null;
      state.status = "idle";
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
  },
});

// Экспортируем действия и редуктор
export const { setCourse, resetCourse, setError } = courseReducer.actions;

// Простой селектор для получения course из состояния
const selectCourseData = (state) => state.course.course?.data;

// Мемоизированный селектор для извлечения преобразованных данных из состояния
export const selectCurrentCourse = createSelector(
  [selectCourseData],
  (courseData) => {
    const attributes = courseData?.attributes || {};

    const cityData = attributes.city?.data?.attributes?.title || "";
    const addressData = attributes.address?.data?.attributes?.title || "";
    const districtData = attributes.district?.data?.attributes?.title || "";
    const teacherData = {
      name:
        attributes.teacher?.data?.attributes?.name +
          " " +
          attributes.teacher?.data?.attributes?.family || "",
      photo:
        attributes.teacher?.data?.attributes?.photo?.data?.attributes?.url ||
        "",
    };

    return {
      id: courseData?.id || null,
      direction: attributes.direction || "",
      description: attributes.description || "",
      format: attributes.format || "",
      level: attributes.level || "",
      items: attributes.items || "",
      inventory: attributes.inventory || false,
      city: cityData,
      address: addressData,
      district: districtData,
      monday: attributes.monday || false,
      tuesday: attributes.tuesday || false,
      wednesday: attributes.wednesday || false,
      thursday: attributes.thursday || false,
      friday: attributes.friday || false,
      saturday: attributes.saturday || false,
      sunday: attributes.sunday || false,
      start_time: attributes.start_time || "",
      age_start: attributes.age_start || "",
      age_end: attributes.age_end || "",
      end_time: attributes.end_time || "",
      start_day: attributes.start_day || "",
      end_day: attributes.end_day || "",
      price_lesson: attributes.price_lesson || 0,
      teacher: teacherData,
      image_url:
        attributes.images?.data?.map((image) => image.attributes.url) || [],
      time_zone: attributes.time_zone || "",
      language: attributes.language || "",
    };
  }
);

export const selectCourseStatus = (state) => state.course.status;
export const selectCourseError = (state) => state.course.error;

// Экспортируем редуктор
export default courseReducer.reducer;
