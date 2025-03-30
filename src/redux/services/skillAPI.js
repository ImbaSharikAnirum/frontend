import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer";

const API = process.env.REACT_APP_API;

export const skillAPI = createApi({
  reducerPath: "skillAPI",
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
  tagTypes: ["Skill"],
  endpoints: (builder) => ({
    createSkill: builder.mutation({
      query: (formData) => ({
        url: `/skills`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Skill"],
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `/skills/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Skill"],
    }),
  }),
});

export const { useCreateSkillMutation, useDeleteSkillMutation } = skillAPI;
