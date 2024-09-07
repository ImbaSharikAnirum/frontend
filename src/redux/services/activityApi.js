import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer";

const API = process.env.REACT_APP_API;

export const activityApi = createApi({
  reducerPath: "activityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers, { getState }) => {
      const token = selectJwt(getState());
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createActivity: builder.mutation({
      query: ({ date, invoice, status }) => ({
        url: "/activities",
        method: "POST",
        body: {
          data: {
            date,
            invoice,
            status,
          },
        },
      }),
    }),
    updateActivity: builder.mutation({
      query: ({ id, date, invoice, status }) => ({
        url: `/activities/${id}`,
        method: "PUT",
        body: {
          data: {
            date,
            invoice,
            status,
          },
        },
      }),
    }),
    fetchActivities: builder.query({
      query: ({ courseId, startDate, endDate }) => ({
        url: "/activities",
        params: {
          courseId,
          startDate,
          endDate,
        },
        method: "GET",
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useCreateActivityMutation,
  useUpdateActivityMutation,
  useFetchActivitiesQuery,
} = activityApi;
