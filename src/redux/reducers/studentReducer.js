import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  students: [], // List of students
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const studentReducer = createSlice({
  name: "student",
  initialState,
  reducers: {
    setStudents: (state, action) => {
      state.students = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    updateStudentPaymentStatus: (state, action) => {
      const { invoiceId, status_payment } = action.payload;
      const studentIndex = state.students.findIndex(
        (student) => student.invoiceId === invoiceId
      );
      if (studentIndex !== -1) {
        state.students[studentIndex].status_payment = status_payment;
      }
    },
    addStudent: (state, action) => {
      state.students.push(action.payload);
      state.status = "succeeded";
      state.error = null;
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    clearStudents: (state) => {
      state.students = [];
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  setStudents,
  addStudent,
  setLoading,
  setError,
  clearStudents,
  updateStudentPaymentStatus,
} = studentReducer.actions;

export const selectAllStudents = (state) => state.student.students;
export const selectStudentStatus = (state) => state.student.status;
export const selectStudentError = (state) => state.student.error;

export default studentReducer.reducer;
