import { createSlice } from "@reduxjs/toolkit";

// Получаем сохраненный язык из localStorage или используем русский по умолчанию
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem("selectedLanguage");
  return savedLanguage || "ru";
};

const initialState = {
  languageCode: getInitialLanguage(),
  isAutoTranslate: false,
  targetLanguage: null,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.languageCode = action.payload;
      // Сохраняем выбранный язык в localStorage
      localStorage.setItem("selectedLanguage", action.payload);
    },
    setAutoTranslate: (state, action) => {
      state.isAutoTranslate = action.payload;
    },
    setTargetLanguage: (state, action) => {
      state.targetLanguage = action.payload;
    },
  },
});

export const { setLanguage, setAutoTranslate, setTargetLanguage } =
  languageSlice.actions;

export const selectLanguageCode = (state) => state.language.languageCode;
export const selectIsAutoTranslate = (state) => state.language.isAutoTranslate;
export const selectTargetLanguage = (state) => state.language.targetLanguage;

export default languageSlice.reducer;
