import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API = process.env.REACT_APP_API;

export const authAPI = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API,
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (user) => ({
        url: "/auth/local/register",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/local",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserDetails: builder.query({
      query: () => ({
        url: "/users/me?populate=role",
        method: "GET",
      }),
    }),
    pinterestAuth: builder.mutation({
      query: (code) => ({
        url: "/pinterest/auth", // Должен быть обработан на бэке Strapi
        method: "POST",
        body: { code },
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetUserDetailsQuery,
  usePinterestAuthMutation,
} = authAPI;
