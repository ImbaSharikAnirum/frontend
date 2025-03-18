// reducers/userProfileReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Объект с данными профиля пользователя
  data: null,
  // Флаг загрузки
  loading: false,
  // Ошибка, если что-то пошло не так
  error: null,
};

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    // Начало загрузки профиля
    fetchUserProfileStart(state) {
      state.loading = true;
      state.error = null;
    },
    // Успешная загрузка профиля
    fetchUserProfileSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    // Ошибка загрузки профиля
    fetchUserProfileFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    // Локальное обновление данных профиля (если необходимо)
    updateUserProfile(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
});

export const {
  fetchUserProfileStart,
  fetchUserProfileSuccess,
  fetchUserProfileFailure,
  updateUserProfile,
} = userProfileSlice.actions;

export default userProfileSlice.reducer;
