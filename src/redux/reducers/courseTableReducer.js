import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeDates: [],
  selectedMonth: "",
  students: [], 
};

const courseTableReducer = createSlice({
  name: "courseTable",
  initialState,
  reducers: {
    setActiveDates: (state, action) => {
      state.activeDates = action.payload;
    },
    clearActiveDates: (state) => {
      state.activeDates = [];
    },
    setSelectedMonth: (state, action) => {
      state.selectedMonth = action.payload;
    },
    clearSelectedMonth: (state) => {
      state.selectedMonth = "";
    },
    setStudents: (state, action) => {
      state.students = action.payload; // Обновляем состояние студентов
    },
    clearStudents: (state) => {
      state.students = []; 
    },
  },
});

export const {
  setActiveDates,
  clearActiveDates,
  setSelectedMonth,
  clearSelectedMonth,
  setStudents,
  clearStudents,
} = courseTableReducer.actions;

export const selectActiveDates = (state) => state.courseTable.activeDates;
export const selectSelectedMonth = (state) => state.courseTable.selectedMonth;
export const selectStudents = (state) => state.courseTable.students;

export default courseTableReducer.reducer;
