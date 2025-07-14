import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
  loading: false,
  error: null,
};
const API = process.env.REACT_APP_API;
const coursesCountSlice = createSlice({
  name: "coursesCount",
  initialState,
  reducers: {
    setCoursesCount(state, action) {
      state.count = action.payload.count;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setCoursesCount, setLoading, setError } =
  coursesCountSlice.actions;

export const fetchCoursesCountFromAPI = () => async (dispatch, getState) => {
  const state = getState();
  const filter = state.filterForCount;

  if (!filter) {
    dispatch(setError("Filter state is undefined"));
    return;
  }

  let query = `pagination[page]=1&pagination[pageSize]=1&populate=0`;

  // Фильтрация по статусу из состояния фильтра
  query += `&filters[status][$eq]=${filter.status}`;

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
    query += `&filters[city][title][$eq]=${filter.city}`;
  }
  if (filter.minPrice) {
    query += `&filters[price_lesson][$gte]=${filter.minPrice}`;
  }
  if (filter.district) {
    query += `&filters[district][title][$eq]=${filter.district}`;
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

  // Дни недели (логика ИЛИ)
  const daysMapping = {
    Понедельник: "monday",
    Вторник: "tuesday",
    Среда: "wednesday",
    Четверг: "thursday",
    Пятница: "friday",
    Суббота: "saturday",
    Воскресенье: "sunday",
  };
  const selectedDays = filter.daysOfWeek.filter((day) => day !== "Неважно");
  if (selectedDays.length > 0) {
    selectedDays.forEach((day, idx) => {
      const apiDayKey = daysMapping[day];
      query += `&filters[$or][${idx}][${apiDayKey}][$eq]=true`;
    });
  }

  dispatch(setLoading(true));

  try {
    const response = await fetch(`${API}/groups?${query}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const count = data.meta.pagination.total;
    dispatch(setCoursesCount({ count }));
  } catch (error) {
    dispatch(setError(error.toString()));
  } finally {
    dispatch(setLoading(false));
  }
};

export default coursesCountSlice.reducer;
