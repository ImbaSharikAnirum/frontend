import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API = process.env.REACT_APP_API;

export const courseAPI = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API,
  }),
  endpoints: (builder) => ({
    fetchCourseById: builder.query({
      query: (id) => ({
        url: `/groups/${id}?&populate[teacher][populate][photo]=*&populate[images]=*&populate[city]=*&populate[address]=*&populate[district]=*`,
        method: "GET",
      }),
    }),
  }),
});

export const { useFetchCourseByIdQuery } = courseAPI;
