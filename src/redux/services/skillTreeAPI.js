// skillTreeAPI.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer";

const API = process.env.REACT_APP_API;

export const skillTreeAPI = createApi({
  reducerPath: "skillTreeAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: API,
    prepareHeaders: (headers, { getState }) => {
      const token = selectJwt(getState());
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["SkillTree"],
  endpoints: (builder) => ({
    createSkillTree: builder.mutation({
      query: (formData) => ({
        url: `/skill-trees`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["SkillTree"],
    }),
    updateSkillTree: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/skill-trees/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["SkillTree"],
    }),
    getSkillTreeById: builder.query({
      query: ({ id }) => ({
        url: `/skill-trees/${id}?populate[image]=*&populate[author]=*&populate[savedBy]=*`,
        method: "GET",
      }),
      providesTags: (result, error, { id }) => [{ type: "SkillTree", id }],
    }),
    getSavedSkillTrees: builder.query({
      query: (userId) => ({
        url: `/skill-trees?filters[savedBy][id][$eq]=${userId}&populate=*&sort=createdAt:desc`,
        method: "GET",
      }),
    }),
    getMySkillTrees: builder.query({
      query: (userId) => ({
        url: `/skill-trees?filters[author][id][$eq]=${userId}&populate=*&sort=createdAt:desc`,
        method: "GET",
      }),
    }),
    saveSkillTree: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/skill-trees/${id}`,
        method: "PUT",
        body: { savedBy: { connect: [{ id: userId }] } },
      }),
      invalidatesTags: ["SkillTree"],
    }),

    unsaveSkillTree: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/skill-trees/${id}`,
        method: "PUT",
        body: { savedBy: { disconnect: [{ id: userId }] } },
      }),
      invalidatesTags: ["SkillTree"],
    }),
    deleteSkillTree: builder.mutation({
      query: (id) => ({
        url: `/skill-trees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SkillTree"],
    }),
  }),
});

export const {
  useCreateSkillTreeMutation,
  useUpdateSkillTreeMutation,
  useGetSkillTreeByIdQuery,
  useLazyGetSkillTreeByIdQuery,
  useGetMySkillTreesQuery,
  useGetSavedSkillTreesQuery,
  useSaveSkillTreeMutation,
  useUnsaveSkillTreeMutation,
  useDeleteSkillTreeMutation,
} = skillTreeAPI;
