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
      // You can use providesTags here for caching and invalidation
    }),
  }),
});

export const { useSignupMutation, useLoginMutation, useGetUserDetailsQuery } =
  authAPI;
