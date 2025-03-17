import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

// Initial state for the invoice
const initialState = {
  invoice: {},
  status: "idle",
  error: null,
};

// Creating the slice
const invoiceBookingReducer = createSlice({
  name: "invoiceBooking",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.status = "loading";
    },
    setInvoice: (state, action) => {
      state.invoice = {
        ...state.invoice,
        ...action.payload,
      };
      state.status = "succeeded";
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
  },
});

// Export actions and reducer
export const { setLoading, setInvoice, setError } =
  invoiceBookingReducer.actions;

// Simple selector for getting the invoice from the state
const selectInvoiceData = (state) => state.invoiceBooking;

// Memoized selector for extracting transformed data from the state
export const selectCurrentInvoice = createSelector(
  [selectInvoiceData],
  (invoiceData) => {
    if (!invoiceData) return null;
    return {
      sum: invoiceData?.invoice?.sum || "",
      currency: invoiceData?.invoice?.currency || "",
      start_day: invoiceData?.invoice?.start_day || "",
      end_day: invoiceData?.invoice?.end_day || "",
      name: invoiceData?.invoice?.name || "",
      family: invoiceData?.invoice?.family || "",
      phone: invoiceData?.invoice?.phone || "",
      activities: invoiceData?.invoice?.activities || [],
      status_payment: invoiceData?.invoice?.status_payment || false,
      group: invoiceData?.invoice?.group || null,
    };
  }
);

export const selectInvoiceStatus = (state) => state.invoice.status;
export const selectInvoiceError = (state) => state.invoice.error;

// Export the reducer
export default invoiceBookingReducer.reducer;
