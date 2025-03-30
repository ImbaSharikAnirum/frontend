// directionAPI.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer";

const API = process.env.REACT_APP_API;

export const directionAPI = createApi({
  reducerPath: "directionAPI",
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
  tagTypes: ["Direction"],
  endpoints: (builder) => ({
    createDirection: builder.mutation({
      query: (formData) => ({
        url: `/directions`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Direction"],
    }),
    deleteDirection: builder.mutation({
      query: (id) => ({
        url: `/directions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Direction"],
    }),
  }),
});

export const { useCreateDirectionMutation, useDeleteDirectionMutation } =
  directionAPI;
