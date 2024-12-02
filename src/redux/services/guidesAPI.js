import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API = process.env.REACT_APP_API;

export const guidesAPI = createApi({
  reducerPath: "guidesAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: API,
  }),
  endpoints: (builder) => ({
    searchPins: builder.query({
      query: (searchQuery) => ({
        url: `/pinterest/search?query=${encodeURIComponent(searchQuery)}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSearchPinsQuery } = guidesAPI;
