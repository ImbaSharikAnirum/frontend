import { createSlice } from "@reduxjs/toolkit";
import { guidesAPI } from "../services/guidesAPI";

const guidesReducer = createSlice({
  name: "guides",
  initialState: {
    guides: [], // Массив для хранения гайдов
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    // Можете добавить редьюсеры для дополнительных операций
    resetGuides: (state) => {
      state.guides = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(guidesAPI.endpoints.searchPins.matchPending, (state) => {
        state.status = "loading";
      })
      .addMatcher(
        guidesAPI.endpoints.searchPins.matchFulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.guides = action.payload; // Сохраняем полученные гайды
        }
      )
      .addMatcher(
        guidesAPI.endpoints.searchPins.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export const { resetGuides } = guidesReducer.actions;
export default guidesReducer.reducer;
