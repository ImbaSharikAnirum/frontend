import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL = "https://api.pinterest.com/v5"; // Правильный URL для Pinterest API

export const guidesAPI = createApi({
  reducerPath: "guidesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = process.env.REACT_APP_PINTEREST_ACCESS_TOKEN;
      if (!token) {
        console.error("Token is missing");
      }
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    searchPins: builder.query({
      query: (searchQuery) => ({
        url: `/search/pins?query=${encodeURIComponent(searchQuery)}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSearchPinsQuery } = guidesAPI;
