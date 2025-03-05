import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  pinterest: [], // List of students
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const pinterestReducer = createSlice({
  name: "pinterest",
  initialState,
  reducers: {
    setPinterest: (state, action) => {
      state.pinterest = action.payload;
      state.status = "succeeded";
      state.error = null;
    },

    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { setPinterest, setLoading, setError } = pinterestReducer.actions;

// Пример правильного использования селектора для получения данных о пинах
export const selectPinterestStatus = (state) => state.pinterest.status;
export const selectPinterestError = (state) => state.pinterest.error;
export const selectAllPinterest = (state) => state.pinterest.pinterest;

export default pinterestReducer.reducer;
