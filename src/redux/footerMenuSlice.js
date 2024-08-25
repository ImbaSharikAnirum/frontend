// footerMenuSlice.js
import { createSlice } from "@reduxjs/toolkit";

const footerMenuSlice = createSlice({
  name: "footerMenu",
  initialState: {
    isVisible: true,
    isFilterMobile: true,
    resetClicked: false,
    searchClicked: false,
    isFilterGroupMobile: false,
  },
  reducers: {
    setFilterMobile(state) {
      state.isFilterMobile = !state.isFilterMobile;
    },
    setFilterGroupMobile(state) {
      state.isFilterGroupMobile = !state.isFilterGroupMobile;
    },
    showFooterMenu(state) {
      state.isVisible = true;
    },
    hideFooterMenu(state) {
      state.isVisible = false;
    },
    toggleFooterMenu(state) {
      state.isVisible = !state.isVisible;
    },
    resetFilters(state) {
      state.resetClicked = !state.resetClicked;
    },
    triggerSearch(state) {
      state.searchClicked = !state.searchClicked;
    },
  },
});

export const {
  showFooterMenu,
  hideFooterMenu,
  toggleFooterMenu,
  setFilterMobile,
  resetFilters,
  triggerSearch,
  setFilterGroupMobile,
} = footerMenuSlice.actions;
export default footerMenuSlice.reducer;
