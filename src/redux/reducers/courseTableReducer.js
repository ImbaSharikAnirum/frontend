import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeDates: [],
  selectedMonth: "",
  students: [],
  followingMonthDetails: {
    month: "",
    startDayOfMonth: "",
    endDayOfMonth: "",
    sum: "",
  },
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
    setFollowingMonthDetails: (state, action) => {
      const { month, startDayOfMonth, endDayOfMonth, sum } = action.payload;
      state.followingMonthDetails = {
        month,
        startDayOfMonth,
        endDayOfMonth,
        sum,
      };
    },
    clearFollowingMonthDetails: (state) => {
      state.followingMonthDetails = {
        month: "",
        startDayOfMonth: "",
        endDayOfMonth: "",
        sum: "",
      };
    },
    setStudents: (state, action) => {
      state.students = action.payload; 
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
  setFollowingMonthDetails,
  clearFollowingMonthDetails,
  setStudents,
  clearStudents,
} = courseTableReducer.actions;

export const selectActiveDates = (state) => state.courseTable.activeDates;
export const selectSelectedMonth = (state) => state.courseTable.selectedMonth;
export const selectFollowingMonthDetails = (state) =>
  state.courseTable.followingMonthDetails;
export const selectStudents = (state) => state.courseTable.students;

export default courseTableReducer.reducer;
