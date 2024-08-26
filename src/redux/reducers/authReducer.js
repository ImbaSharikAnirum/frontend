import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние без типов
const initialState = {
  user: null,
  jwt: null,
  isInitialized: false, // Добавленный флаг
};

// Создание среза (slice)
const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.jwt = action.payload.jwt;
      state.isInitialized = true; // Установите флаг при установке пользователя
    },
    setInitialized: (state) => {
      state.isInitialized = true; // Установка флага инициализации
    },
    logout: (state) => {
      state.user = null;
      state.jwt = null;
      state.isInitialized = true; // Обеспечьте, что флаг устанавливается также при выходе
    },
  },
});

// Экспортируем действия и редуктор
export const { setUser, logout, setInitialized } = authReducer.actions;

// Селекторы для извлечения данных из состояния
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectJwt = (state) => state.auth.jwt;

// Экспортируем редуктор
export default authReducer.reducer;
