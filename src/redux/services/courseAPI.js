import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer";

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
  endpoints: (builder) => ({
    fetchCourseById: builder.query({
      query: (id) => ({
        url: `/groups/${id}?&populate[teacher][populate][photo]=*&populate[images]=*`,
        method: "GET",
      }),
    }),

    createGroup: builder.mutation({
      query: (formData) => ({
        url: "/groups",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Здесь можно добавить дополнительные действия после успешного создания группы
          console.log("Группа успешно создана:", data);
        } catch (error) {
          console.error("Ошибка при создании группы:", error);
        }
      },
    }),
  }),
});

// ✅ экспортируй оба хука
export const { useFetchCourseByIdQuery, useCreateGroupMutation } = courseAPI;
