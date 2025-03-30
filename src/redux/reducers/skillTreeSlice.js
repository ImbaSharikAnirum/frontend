// features/skillTree/skillTreeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nodes: [],
  edges: [],
  activeSkillTreeId: null, // ⬅️ Добавили
  mySkillTrees: [],
  savedSkillTrees: [],
};

const skillTreeSlice = createSlice({
  name: "skillTree",
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action) => {
      state.edges = action.payload;
    },
    updateNodes: (state, action) => {
      state.nodes = [...action.payload];
    },
    updateEdges: (state, action) => {
      state.edges = [...action.payload];
    },
    setActiveSkillTreeId: (state, action) => {
      state.activeSkillTreeId = action.payload;
    },
    setMySkillTrees: (state, action) => {
      state.mySkillTrees = action.payload;
    },
    setSavedSkillTrees: (state, action) => {
      state.savedSkillTrees = action.payload;
    },
    addToMySkillTrees: (state, action) => {
      state.mySkillTrees.push(action.payload);
    },
    removeFromMySkillTrees: (state, action) => {
      state.mySkillTrees = state.mySkillTrees.filter(
        (tree) => tree.id !== action.payload
      );
    },
    addToSavedSkillTrees: (state, action) => {
      state.savedSkillTrees.push(action.payload);
    },
    removeFromSavedSkillTrees: (state, action) => {
      state.savedSkillTrees = state.savedSkillTrees.filter(
        (tree) => tree.id !== action.payload
      );
    },
  },
});

export const {
  setNodes,
  setEdges,
  updateNodes,
  updateEdges,
  setActiveSkillTreeId,
  setMySkillTrees,
  setSavedSkillTrees,
  addToMySkillTrees,
  removeFromMySkillTrees,
  addToSavedSkillTrees,
  removeFromSavedSkillTrees,
} = skillTreeSlice.actions;
export default skillTreeSlice.reducer;
