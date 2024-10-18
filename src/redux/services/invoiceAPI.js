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
    fetchInvoicesByCourseId: builder.query({
      query: ({ courseId, startDate, endDate }) => {
        const params = new URLSearchParams();

        if (courseId) params.append("filters[group][id][$eq]", courseId);
        if (startDate) params.append("filters[start_day][$gte]", startDate);
        if (endDate) params.append("filters[end_day][$lte]", endDate);

        return {
          url: `/invoices?${params.toString()}&populate[activities]=*`,
        };
      },
    }),
    updateInvoicePaymentStatus: builder.mutation({
      query: ({ invoiceId, status_payment }) => ({
        url: `/invoices/${invoiceId}`,
        method: "PUT",
        body: {
          data: {
            status_payment: status_payment,
          },
        },
      }),
    }),
    updateInvoiceSum: builder.mutation({
      query: ({ invoiceId, sum }) => ({
        url: `/invoices/${invoiceId}`,
        method: "PUT",
        body: {
          data: {
            sum: sum,
          },
        },
      }),
    }),
    deleteInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: `/invoices/${invoiceId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateInvoiceMutation,
  useFetchInvoicesByCourseIdQuery,
  useUpdateInvoicePaymentStatusMutation,
  useUpdateInvoiceSumMutation,
  useDeleteInvoiceMutation,
} = invoiceAPI;
