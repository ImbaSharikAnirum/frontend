import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import moment from "moment";

const initialState = {
  monthsWithActiveDays: [],
  nextMonth: [],
  selectedMonth: null,
};

const monthCalculationSlice = createSlice({
  name: "monthCalculation",
  initialState,
  reducers: {
    setMonthsWithActiveDays: (state, action) => {
      state.monthsWithActiveDays = action.payload;
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    setNextMonth: (state, action) => {
      state.nextMonth = action.payload;
    },
  },
});

// Экспортируем action
export const { setMonthsWithActiveDays, setSelectedMonth, setNextMonth } =
  monthCalculationSlice.actions;

// Селектор для получения данных
export const selectMonthsWithActiveDays = (state) =>
  state.monthCalculation.monthsWithActiveDays;
export const selectSelectedMonth = (state) =>
  state.monthCalculation.selectedMonth;
export const selectNextMonth = (state) => state.monthCalculation.nextMonth;

export const selectActiveDaysForSelectedMonth = createSelector(
  [selectSelectedMonth, selectMonthsWithActiveDays],
  (selectedMonth, monthsWithActiveDays) => {
    const monthData = monthsWithActiveDays.find(
      (month) => month.month === selectedMonth
    );
    return monthData ? monthData.activeDays : [];
  }
);

// Экспортируем редюсер
export default monthCalculationSlice.reducer;
