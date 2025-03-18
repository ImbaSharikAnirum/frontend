// src/redux/reducers/portfolioReducer.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // список портфолио
  selected: null, // выбранное портфолио (для просмотра/редактирования)
  isLoading: false, // флаг загрузки (если понадобится)
  error: null, // сообщение об ошибке
};

const portfolioReducer = createSlice({
  name: "portfolio",
  initialState,
  reducers: {
    setPortfolios(state, action) {
      state.items = action.payload;
      state.error = null;
    },
    addPortfolio(state, action) {
      state.items.push(action.payload);
      state.error = null;
    },
    updatePortfolio(state, action) {
      const idx = state.items.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
      state.error = null;
    },
    removePortfolio(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.error = null;
    },
    setSelectedPortfolio(state, action) {
      state.selected = action.payload;
      state.error = null;
    },
    clearSelectedPortfolio(state) {
      state.selected = null;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setPortfolios,
  addPortfolio,
  updatePortfolio,
  removePortfolio,
  setSelectedPortfolio,
  clearSelectedPortfolio,
  setLoading,
  setError,
} = portfolioReducer.actions;

export default portfolioReducer.reducer;

