// файл: reducers/creationReducer.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  creations: [],
};

const creationReducer = createSlice({
  name: "creation",
  initialState,
  reducers: {
    setCreations(state, action) {
      state.creations = action.payload;
    },
    addCreation(state, action) {
      state.creations.push(action.payload);
    },
    removeCreation(state, action) {
      state.creations = state.creations.filter(
        (creation) => creation.id !== action.payload
      );
    },
  },
});

export const { setCreations, addCreation, removeCreation } =
  creationReducer.actions;
export default creationReducer.reducer;
