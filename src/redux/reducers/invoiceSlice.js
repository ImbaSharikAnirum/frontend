// redux/reducers/invoiceReducer.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoicesCourseTable: [], // Здесь хранятся инвойсы, связанные с курсами
  isInvoiceDeletedCourseTable: false,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setInvoicesCourseTable: (state, action) => {
      state.invoicesCourseTable = action.payload;
    },

  },
});

export const { setInvoicesCourseTable } =
  invoiceSlice.actions;

export default invoiceSlice.reducer;
