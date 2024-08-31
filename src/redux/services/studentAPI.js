import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer"; // Импортируйте селектор для получения токена

const API = process.env.REACT_APP_API;

export const studentAPI = createApi({
  reducerPath: "studentAPI",
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
    createStudent: builder.mutation({
      query: (student) => ({
        url: "/students",
        method: "POST",
        body: {
          data: student,
        },
      }),
    }),

    getStudents: builder.query({
      query: ({ query }) => ({
        url: `/students`,
        params: {
          "filters[$or][0][name][$contains]": query.toString(),
          "filters[$or][1][family][$contains]": query.toString(),
          "filters[$or][2][phone][$contains]": query.toString(),
        },
        method: "GET",
      }),
      transformResponse: (response) => {
        return response.data.map((student) => ({
          id: student.id,
          name: student.attributes.name,
          family: student.attributes.family,
          phone: student.attributes.phone,
        }));
      },
    }),
    getStudentsByUserId: builder.query({
      query: (userId) => ({
        url: `/students`,
        params: {
          "filters[users_permissions_user][$eq]": userId,
        },
        method: "GET",
      }),
      transformResponse: (response) => {
        // Извлекаем данные из 'data' и 'attributes'
        return response.data.map((student) => ({
          id: student.id,
          name: student.attributes.name,
          family: student.attributes.family,
          phone: student.attributes.phone,
        }));
      },
    }),

    deleteStudent: builder.mutation({
      query: (studentId) => ({
        url: `/students/${studentId}`,
        method: "DELETE",
      }),
    }),
    updateStudent: builder.mutation({
      query: ({ id, ...updatedStudent }) => ({
        url: `students/${id}`,
        method: "PUT",
        body: {
          data: updatedStudent,
        },
      }),
    }),
  }),
});

export const {
  useCreateStudentMutation,
  useGetStudentsByUserIdQuery,
  useGetStudentsQuery,
  useLazyGetStudentsQuery,
  useDeleteStudentMutation,
  useUpdateStudentMutation,
} = studentAPI;
