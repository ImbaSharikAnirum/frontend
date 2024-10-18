import { createSlice } from "@reduxjs/toolkit";
import { hideFooterMenu, showFooterMenu } from "../footerMenuSlice"; // Импортируем экшены для футера

const initialState = {
  studentDataModalOpen: false,
  editingStudentDataModalOpen: false,
  deleteInvoiceModalOpen: false,
};

const modalReducer = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openStudentDataModal(state, action) {
      state.studentDataModalOpen = true;
      state.studentData = action.payload; // Сохраняем данные студента в состоянии
    },
    closeStudentDataModal(state) {
      state.studentDataModalOpen = false;
      state.studentData = null;
    },
    openDeleteInvoiceModal(state, action) {
      state.deleteInvoiceModalOpen = true;
      state.studentData = action.payload;
    },
    closeDeleteInvoiceModal(state) {
      state.deleteInvoiceModalOpen = false;
      state.studentData = null;
    },
    openEditSumModal(state, action) {
      state.editSumModalOpen = true;
      state.studentData = action.payload;
    },
    closeEditSumModal(state) {
      state.editSumModalOpen = false;
      state.studentData = null;
    },
  },
});

// Обёртка для открытия модалки студента и скрытия футера
export const openStudentDataModalWithFooter = (studentData) => (dispatch) => {
  dispatch(hideFooterMenu()); // Скрываем футер
  dispatch(openStudentDataModal(studentData)); // Открываем модалку с данными студента
};

// Обёртка для закрытия модалки студента и показа футера
export const closeStudentDataModalWithFooter = () => (dispatch) => {
  dispatch(closeStudentDataModal()); // Закрываем модалку
  dispatch(showFooterMenu()); // Показываем футер
};

// То же самое для модалки удаления инвойса
export const openDeleteInvoiceModalWithFooter = () => (dispatch) => {
  dispatch(hideFooterMenu());
  dispatch(openDeleteInvoiceModal());
};
export const openEditSumModalWithFooter = () => (dispatch) => {
  dispatch(hideFooterMenu());
  dispatch(openEditSumModal());
};

export const closeDeleteInvoiceModalWithFooter = () => (dispatch) => {
  dispatch(closeDeleteInvoiceModal());
  dispatch(showFooterMenu());
};

export const {
  openStudentDataModal,
  closeStudentDataModal,
  openDeleteInvoiceModal,
  closeDeleteInvoiceModal,
  openEditSumModal, // Новый экшен для открытия модалки редактирования суммы
  closeEditSumModal, // Новый экшен для закрытия модалки редактирования суммы
} = modalReducer.actions;

export default modalReducer.reducer;
