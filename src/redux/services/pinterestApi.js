import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer"; // Импортируйте селектор для получения токена

const API = process.env.REACT_APP_API;

export const pinterestAPI = createApi({
  reducerPath: "pinterestApi",
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
    fetchPins: builder.query({
      query: () => ({
        url: "/pinterest/get", // Эндпоинт для получения пинов
        method: "GET",
      }),
    }),
    savePinterestGuide: builder.mutation({
      query: (data) => ({
        url: "/save-pinterest-guide", // Эндпоинт для сохранения гайда из Pinterest
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useFetchPinsQuery, // Хук для использования в компоненте
  useSavePinterestGuideMutation, // Хук для сохранения гайда из Pinterest
} = pinterestAPI;
