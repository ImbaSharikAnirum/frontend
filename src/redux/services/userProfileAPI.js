import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer";

const API = process.env.REACT_APP_API;

export const userProfileAPI = createApi({
  reducerPath: "userProfileAPI",
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
    getUserProfileDetails: builder.query({
      query: (userId) => ({
        url: `/users/${userId}?populate[photo]=*&populate[avatar]=*`,
        method: "GET",
      }),
    }),
  }),
});

// Генерируется хук useGetUserProfileDetailsQuery
export const { useGetUserProfileDetailsQuery } = userProfileAPI;
