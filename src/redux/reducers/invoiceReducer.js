import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

// Initial state for the invoice
const initialState = {
  invoice: null,
  status: "idle",
  error: null,
};

// Creating the slice
const invoiceReducer = createSlice({
  name: "invoice",
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
export const { setLoading, setInvoice, setError } = invoiceReducer.actions;

// Simple selector for getting the invoice from the state
const selectInvoiceData = (state) => state.invoice.invoice;

// Memoized selector for extracting transformed data from the state
export const selectCurrentInvoice = createSelector(
  [selectInvoiceData],
  (invoiceData) => {
    if (!invoiceData) return null;
    return {
      sum: invoiceData?.sum || "",
      currency: invoiceData?.currency || "",
      start_day: invoiceData?.start_day || "",
      end_day: invoiceData?.end_day || "",
      name: invoiceData?.name || "",
      family: invoiceData?.family || "",
      phone: invoiceData?.phone || "",
      activities: invoiceData?.activities || [],
      status_payment: invoiceData?.status_payment || false,
      group: invoiceData?.group || null,
    };
  }
);

export const selectInvoiceStatus = (state) => state.invoice.status;
export const selectInvoiceError = (state) => state.invoice.error;

// Export the reducer
export default invoiceReducer.reducer;
