import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterSlice";
import coursesReducer from "./coursesSlice";
import coursesCountReducer from "./coursesCountSlice";
import filterForCountReducer from "./filterForCountSlice";
import footerMenuReducer from "./footerMenuSlice";
import { authAPI } from "./services/authAPI";
import { courseAPI } from "./services/courseAPI";
import { studentAPI } from "./services/studentAPI";
import { invoiceAPI } from "./services/invoiceAPI";
import authReducer from "./reducers/authReducer";
import courseReducer from "./reducers/courseReducer";
import studentReducer from "./reducers/studentReducer";
import invoiceReducer from "./reducers/invoiceReducer";
import courseTableReducer from "./reducers/courseTableReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    course: courseReducer,
    filter: filterReducer,
    courses: coursesReducer,
    coursesCount: coursesCountReducer,
    filterForCount: filterForCountReducer,
    footerMenu: footerMenuReducer,
    student: studentReducer,
    invoice: invoiceReducer,
    courseTable: courseTableReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [courseAPI.reducerPath]: courseAPI.reducer,
    [studentAPI.reducerPath]: studentAPI.reducer,
    [invoiceAPI.reducerPath]: invoiceAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      courseAPI.middleware,
      studentAPI.middleware,
      invoiceAPI.middleware
    ),
});
