import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer";
import { selectCurrencyCode } from "../reducers/currencyReducer";

const API = process.env.REACT_APP_API;

export const courseAPI = createApi({
  reducerPath: "courseApi",
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
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    fetchCourseById: builder.query({
      queryFn: async (id, { getState }) => {
        const state = getState();
        const currency = selectCurrencyCode(state) || "RUB";
        const response = await fetch(
          `${API}/groups/${id}?populate[teacher][populate][photo]=*&populate[images]=*&currency=${currency}`
        );
        const data = await response.json();
        return { data };
      },
      providesTags: (result, error, id) => [
        { type: "Course", id },
        { type: "Course", id: "LIST" },
      ],
    }),

    createGroup: builder.mutation({
      query: (formData) => ({
        url: "/groups",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Course"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Ошибка при создании группы:", error);
        }
      },
    }),
  }),
});

// Добавляем middleware для инвалидации кэша при смене валюты
export const currencyMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  if (action.type === "currency/setCurrency") {
    // Инвалидируем все теги Course
    store.dispatch(courseAPI.util.invalidateTags(["Course"]));
  }

  return result;
};

export const { useFetchCourseByIdQuery, useCreateGroupMutation } = courseAPI;
