import { createSlice } from "@reduxjs/toolkit";
// import { setCoursesCount } from "./coursesCountSlice";

// Преобразование данных из API
const transformDataFromAPI = (data) => {
  return data.map((item) => {
    const attributes = item.attributes;

    const cityData = attributes.city?.data?.attributes?.title || "";
    const addressData = attributes.address?.data?.attributes?.title || "";
    const districtData = attributes.district?.data?.attributes?.title || "";
    const teacherData = {
      photo:
        attributes.teacher?.data?.attributes?.photo?.data?.attributes?.url ||
        "",
    };
    return {
      id: item.id,
      direction: attributes.direction,
      format: attributes.format,
      city: cityData,
      address: addressData,
      district: districtData,
      monday: attributes.monday,
      tuesday: attributes.tuesday,
      wednesday: attributes.wednesday,
      thursday: attributes.thursday,
      friday: attributes.friday,
      saturday: attributes.saturday,
      sunday: attributes.sunday,
      start_time: attributes.start_time,
      end_time: attributes.end_time,
      start_day: attributes.start_day,
      end_day: attributes.end_day,
      price_lesson: attributes.price_lesson,
      teacher: teacherData,
      image_url: attributes.images.data.map((image) => image.attributes.url),
      time_zone: attributes.time_zone,
      city_en: attributes.city_en || "",
      district_en: attributes.district_en || "",
      administrativeArea_en: attributes.administrativeArea_en || "",
      route_en: attributes.route_en || "",
      name_en: attributes.name_en || "",
      streetNumber_en: attributes.streetNumber_en || "",
      country_en: attributes.country_en || "",
      city_original_language: attributes.city_original_language || "",
      district_original_language: attributes.district_original_language || "",
      administrativeArea_original_language:
        attributes.administrativeArea_original_language || "",
      route_original_language: attributes.route_original_language || "",
      name_original_language: attributes.name_original_language || "",
      streetNumber_original_language:
        attributes.streetNumber_original_language || "",
      country_original_language: attributes.country_original_language || "",
      original_language: attributes.original_language || "ru",
      display_location_name: attributes.display_location_name || "",
    };
  });
};
const API = process.env.REACT_APP_API;
const coursesSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    count: 0, // Добавлено для хранения количества
  },
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload.courses;
    },
    appendCourses: (state, action) => {
      state.courses = [...state.courses, ...action.payload.courses];
    },
    resetCourses: (state) => {
      state.courses = [];
    },
  },
});

export const { setCourses, appendCourses, resetCourses } = coursesSlice.actions;

export const fetchCoursesFromAPI =
  (page = 1) =>
  async (dispatch, getState) => {
    let query =
      `populate[district]=*` +
      `&populate[address]=*` +
      `&populate[city]=*` +
      `&populate[images]=*` +
      `&populate[teacher][populate][photo]=*` +
      `&pagination[page]=${page}` +
      `&pagination[pageSize]=15`;

    // Применение фильтров, если они установлены
    const { filter } = getState();
    if (filter.start_time && filter.end_time) {
      if (filter.start_time > filter.end_time) {
        query += `&filters[start_time_moscow][$gte]=00:00:00`;
        query += `&filters[start_time_moscow][$lte]=${filter.end_time}`;
      } else {
        query += `&filters[start_time_moscow][$gte]=${filter.start_time}`;
        query += `&filters[start_time_moscow][$lte]=${filter.end_time}`;
      }
    }
    if (filter.direction) {
      query += `&filters[direction][$eq]=${filter.direction}`;
    }
    if (filter.format) {
      query += `&filters[format][$eq]=${filter.format}`;
    }
    if (filter.city) {
      const cityValue =
        filter.city.city_en || filter.city.city_original_language;
      if (cityValue) {
        query += `&filters[$or][0][city_en][$eq]=${cityValue}`;
        query += `&filters[$or][1][city_original_language][$eq]=${cityValue}`;
      }
    }
    if (filter.district) {
      const districtValue =
        filter.district.district_en ||
        filter.district.district_original_language;
      if (districtValue) {
        query += `&filters[$or][0][district_en][$eq]=${districtValue}`;
        query += `&filters[$or][1][district_original_language][$eq]=${districtValue}`;
      }
    }
    if (filter.minPrice) {
      query += `&filters[price_lesson][$gte]=${filter.minPrice}`;
    }
    if (filter.maxPrice) {
      query += `&filters[price_lesson][$lte]=${filter.maxPrice}`;
    }
    if (filter.teacher) {
      query += `&filters[teacher][id][$eq]=${filter.teacher}`;
    }
    if (filter.age) {
      query += `&filters[age_start][$lte]=${filter.age}&filters[age_end][$gte]=${filter.age}`;
    }

    const daysMapping = {
      Понедельник: "monday",
      Вторник: "tuesday",
      Среда: "wednesday",
      Четверг: "thursday",
      Пятница: "friday",
      Суббота: "saturday",
      Воскресенье: "sunday",
    };
    filter.daysOfWeek.forEach((day) => {
      if (day !== "Неважно") {
        const apiDayKey = daysMapping[day];
        query += `&filters[${apiDayKey}][$eq]=true`;
      }
    });

    try {
      const response = await fetch(`${API}/groups?${query}`);
      const result = await response.json();
      const transformedData = transformDataFromAPI(result.data);

      const totalCount = result.meta?.pagination?.total || 0;

      if (page === 1) {
        dispatch(setCourses({ courses: transformedData }));
      } else {
        dispatch(appendCourses({ courses: transformedData }));
      }
      return { courses: transformedData, totalCount };
    } catch (error) {
      console.error("Failed to fetch courses: ", error);
      return { courses: [], totalCount: 0 };
    }
  };

export default coursesSlice.reducer;
