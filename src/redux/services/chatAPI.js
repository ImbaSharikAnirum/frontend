import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer"; // Импортируйте селектор для получения токена

const API = process.env.REACT_APP_API;

export const chatAPI = createApi({
  reducerPath: "chatAPI",
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
    getChats: builder.query({
      query: () => ({
        url: `/chats?populate[contact]=*&populate[messages][sort]=timestamp:asc&populate[messages][pagination][limit]=50&populate[shannel]=*`,
      }),
      transformResponse: (response) => {
        return response.data;
      },
    }),
  }),
});

export const { useGetChatsQuery } = chatAPI;
