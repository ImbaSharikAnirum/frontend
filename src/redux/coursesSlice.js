import { createSlice } from "@reduxjs/toolkit";
import { selectCurrencyCode } from "./reducers/currencyReducer";
import moment from "moment-timezone";
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
    isLoading: false, // Добавляем состояние загрузки
  },
  reducers: {
    setCourses: (state, action) => {
      state.courses = action.payload.courses;
      state.isLoading = false;
    },
    appendCourses: (state, action) => {
      state.courses = [...state.courses, ...action.payload.courses];
      state.isLoading = false;
    },
    resetCourses: (state) => {
      state.courses = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase("currency/setCurrency", (state, action) => {
      // При смене валюты сбрасываем курсы и включаем состояние загрузки
      state.courses = [];
      state.isLoading = true;
    });
  },
});

export const { setCourses, appendCourses, resetCourses, setLoading } =
  coursesSlice.actions;

// Функция для проверки наличия занятий в следующем месяце
const hasLessonsInNextMonth = (course) => {
  const now = moment();
  const startOfNextMonth = now.clone().add(1, "months").startOf("month");
  const endOfNextMonth = now.clone().add(1, "months").endOf("month");
  const courseStartDate = moment(course.start_day);
  const courseEndDate = moment(course.end_day);

  // Проверяем, что курс еще активен
  if (courseEndDate.isBefore(now)) {
    return false;
  }

  // Проверяем, что курс начинается до конца следующего месяца
  if (courseStartDate.isAfter(endOfNextMonth)) {
    return false;
  }

  // Проверяем наличие активных дней недели
  const hasActiveDays =
    course.monday ||
    course.tuesday ||
    course.wednesday ||
    course.thursday ||
    course.friday ||
    course.saturday ||
    course.sunday;

  return hasActiveDays;
};

export const fetchCoursesFromAPI =
  (page = 1) =>
  async (dispatch, getState) => {
    const state = getState();
    const userCurrency = selectCurrencyCode(state);

    let query =
      `populate[district]=*` +
      `&populate[address]=*` +
      `&populate[city]=*` +
      `&populate[images]=*` +
      `&populate[teacher][populate][photo]=*` +
      `&pagination[page]=${page}` +
      `&pagination[pageSize]=15` +
      `&currency=${userCurrency}`;

    // Добавляем фильтр по дате окончания курса
    const now = moment();
    const endOfNextMonth = now.clone().add(1, "months").endOf("month");
    query += `&filters[end_day][$gte]=${now.format("YYYY-MM-DD")}`;
    query += `&filters[start_day][$lte]=${endOfNextMonth.format("YYYY-MM-DD")}`;

    // Добавляем фильтр по наличию активных дней недели
    query += `&filters[$or][0][monday][$eq]=true`;
    query += `&filters[$or][1][tuesday][$eq]=true`;
    query += `&filters[$or][2][wednesday][$eq]=true`;
    query += `&filters[$or][3][thursday][$eq]=true`;
    query += `&filters[$or][4][friday][$eq]=true`;
    query += `&filters[$or][5][saturday][$eq]=true`;
    query += `&filters[$or][6][sunday][$eq]=true`;

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

      // Дополнительная фильтрация на клиенте для точного подсчета занятий
      const filteredData = transformedData.filter((course) => {
        const lessonsCount = countLessonsInNextMonth(course);
        return lessonsCount > 0;
      });

      const totalCount = filteredData.length;

      if (page === 1) {
        dispatch(setCourses({ courses: filteredData }));
      } else {
        dispatch(appendCourses({ courses: filteredData }));
      }
      return { courses: filteredData, totalCount };
    } catch (error) {
      console.error("Failed to fetch courses: ", error);
      return { courses: [], totalCount: 0 };
    }
  };

// Функция для подсчета занятий в следующем месяце
const countLessonsInNextMonth = (course) => {
  const now = moment();
  const startOfNextMonth = now.clone().add(1, "months").startOf("month");
  const endOfNextMonth = now.clone().add(1, "months").endOf("month");
  const courseStartDate = moment(course.start_day);
  const courseEndDate = moment(course.end_day);

  const activeDays = {
    monday: course.monday,
    tuesday: course.tuesday,
    wednesday: course.wednesday,
    thursday: course.thursday,
    friday: course.friday,
    saturday: course.saturday,
    sunday: course.sunday,
  };

  let lessonCount = 0;
  for (
    let day = startOfNextMonth.clone();
    day.locale("en").isSameOrBefore(endOfNextMonth);
    day.add(1, "days")
  ) {
    const dayOfWeek = day.locale("en").format("dddd").toLowerCase();
    if (
      day.locale("en").isSameOrAfter(courseStartDate, "day") &&
      day.locale("en").isSameOrBefore(courseEndDate, "day") &&
      activeDays[dayOfWeek]
    ) {
      lessonCount++;
    }
  }

  return lessonCount;
};

// Добавляем middleware для автоматической загрузки курсов при смене валюты
export const currencyMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === "currency/setCurrency") {
    store.dispatch(fetchCoursesFromAPI(1));
  }

  return result;
};

export default coursesSlice.reducer;
