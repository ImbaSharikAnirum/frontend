import { createSlice } from "@reduxjs/toolkit";
import { activityApi } from "../services/activityApi";

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    activities: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        activityApi.endpoints.createActivity.matchPending,
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        activityApi.endpoints.createActivity.matchFulfilled,
        (state, action) => {
          state.status = "succeeded";
          state.activities.push(action.payload); // Добавляем новую активность в массив
        }
      )
      .addMatcher(
        activityApi.endpoints.createActivity.matchRejected,
        (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        }
      );
  },
});

export default activitySlice.reducer;
