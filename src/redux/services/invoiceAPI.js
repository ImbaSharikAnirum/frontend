import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { selectJwt } from "../reducers/authReducer"; // Импортируйте селектор для получения токена

const API = process.env.REACT_APP_API;

export const invoiceAPI = createApi({
  reducerPath: "invoiceApi",
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
    createInvoice: builder.mutation({
      query: (invoiceData) => ({
        url: `/invoices`,
        method: "POST",
        body: {
          data: invoiceData,
        },
      }),
    }),
  }),
});

export const { useCreateInvoiceMutation } = invoiceAPI;
