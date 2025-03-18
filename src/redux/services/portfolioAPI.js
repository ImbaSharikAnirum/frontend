import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer";

const API = process.env.REACT_APP_API;

export const portfolioAPI = createApi({
  reducerPath: "portfolio",
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
  tagTypes: ["portfolio"],
  endpoints: (builder) => ({
    getPortfolios: builder.query({
      query: ({ userId, page = 1 } = {}) => {
        let url =
          `/portfolios?pagination[page]=${page}&pagination[pageSize]=30` +
          `&populate[images]=*&sort=publishedAt:desc`;
        if (userId) {
          url += `&filters[users_permissions_user][id][$eq]=${userId}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["portfolio"],
    }),
  }),
});

export const { useGetPortfoliosQuery } = portfolioAPI;
