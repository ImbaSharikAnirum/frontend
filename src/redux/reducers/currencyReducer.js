import { createSlice } from "@reduxjs/toolkit";
import { CURRENCIES } from "../../utils/constants";

// Получаем начальное значение из localStorage или используем RUB по умолчанию
const getInitialCurrency = () => {
  const savedCurrency = localStorage.getItem("currency");
  if (savedCurrency) {
    try {
      return JSON.parse(savedCurrency);
    } catch (e) {
      return CURRENCIES.RUB;
    }
  }
  return CURRENCIES.RUB;
};

const initialState = {
  currency: getInitialCurrency(),
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency = action.payload;
      // Сохраняем в localStorage
      localStorage.setItem("currency", JSON.stringify(action.payload));
    },
  },
});

export const { setCurrency } = currencySlice.actions;

// Селекторы
export const selectCurrency = (state) => state.currency.currency;
export const selectCurrencySymbol = (state) =>
  state.currency.currency?.symbol || "₽";
export const selectCurrencyCode = (state) =>
  state.currency.currency?.code || "RUB";

export default currencySlice.reducer;
