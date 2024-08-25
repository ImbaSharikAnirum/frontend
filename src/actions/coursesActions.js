// src/actions/coursesActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/courses"); // Замените на ваш API-эндпоинт
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
