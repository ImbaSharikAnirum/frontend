import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer";

const API = process.env.REACT_APP_API;

export const creationAPI = createApi({
  reducerPath: "creation",
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
  tagTypes: ["creation"],
  endpoints: (builder) => ({
    getCreations: builder.query({
      query: ({ userId, page = 1 } = {}) => {
        let url =
          `/creations?pagination[page]=${page}&pagination[pageSize]=30` +
          `&populate[image]=*&sort=publishedAt:desc`;
        if (userId) {
          url += `&filters[users_permissions_user][id][$eq]=${userId}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["creation"],
    }),
  }),
});

export const { useGetCreationsQuery } = creationAPI;
