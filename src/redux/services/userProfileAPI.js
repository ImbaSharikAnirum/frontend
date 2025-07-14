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
  tagTypes: ["UserProfile"],
  endpoints: (builder) => ({
    getUserProfileDetails: builder.query({
      query: (userId) => ({
        url: `users/${userId}?populate[photo]=*&populate[avatar]=*&populate[role]=*`,
        method: "GET",
      }),
      providesTags: ["UserProfile"],
    }),
    updateTeacherRoleRequest: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: {
          requestedTeacherRole: true,
        },
      }),
      invalidatesTags: ["UserProfile"],
    }),
    getTeacherApplications: builder.query({
      query: () => ({
        url: `users?filters[requestedTeacherRole][$eq]=true&populate[avatar]=*`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "TeacherApplications", id })),
              { type: "TeacherApplications", id: "LIST" },
            ]
          : [{ type: "TeacherApplications", id: "LIST" }],
    }),
    approveTeacherRole: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: {
          role: Number(process.env.REACT_APP_TEACHER),
          requestedTeacherRole: false,
        },
      }),
      invalidatesTags: [
        { type: "TeacherApplications", id: "LIST" },
        "UserProfile",
      ],
    }),
    rejectTeacherRole: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: {
          requestedTeacherRole: false,
          rejectedAt: new Date().toISOString(),
        },
      }),
      invalidatesTags: [
        { type: "TeacherApplications", id: "LIST" },
        "UserProfile",
      ],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["UserProfile"],
    }),
  }),
});

// Генерируется хук useGetUserProfileDetailsQuery
export const {
  useGetUserProfileDetailsQuery,
  useUpdateTeacherRoleRequestMutation,
  useGetTeacherApplicationsQuery,
  useApproveTeacherRoleMutation,
  useRejectTeacherRoleMutation,
  useUpdateUserMutation,
} = userProfileAPI;
